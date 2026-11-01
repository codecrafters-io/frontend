import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { waitFor } from '@ember/test-waiters';
import type Store from '@ember-data/store';
import type CourseModel from 'codecrafters-frontend/models/course';
import type OnboardingSurveyModel from 'codecrafters-frontend/models/onboarding-survey';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import scrollToTop from 'codecrafters-frontend/utils/scroll-to-top';
import wordmarkDark from '/assets/images/logo/wordmark-dark.svg';
import { roles, experienceRanges, companySizes } from 'codecrafters-frontend/utils/onboarding-profile-options';
import type OnboardingPreferencesService from 'codecrafters-frontend/services/onboarding-preferences';
import { onboardingGoals, recommendedCourseSlugs, recommendationReason } from 'codecrafters-frontend/utils/onboarding-recommendations';

interface Signature {
  Args: {
    onboardingSurvey: OnboardingSurveyModel;
    courses: CourseModel[];
    hasNextDestination: boolean;
    onSurveyComplete: () => void;
  };
  Element: HTMLDivElement;
}

export default class OnboardingSurveyWizard extends Component<Signature> {
  @service declare store: Store;
  @service declare authenticator: AuthenticatorService;
  @service declare onboardingPreferences: OnboardingPreferencesService;
  @tracked currentStep = 1;
  @tracked isSaving = false;
  @tracked saveError: string | null = null;
  @tracked goal =
    this.args.onboardingSurvey.selectedOptionsForUsagePurpose[0] || (this.args.onboardingSurvey.freeFormAnswerForUsagePurpose.trim() ? 'other' : '');

  @tracked role = '';
  @tracked otherRole = '';
  @tracked experience = '';
  @tracked companySize = '';
  @tracked profileSkipped = false;
  wordmarkUrl = wordmarkDark;
  private savedProfileSnapshot: string | null = null;
  goals = onboardingGoals;
  roles = roles;
  experienceRanges = experienceRanges;
  companySizes = companySizes;

  get preferences() {
    return {
      goal: this.profileSkipped ? '' : this.goal,
      role: this.profileSkipped ? '' : this.role,
      experience: this.profileSkipped ? '' : this.experience,
      companySize: this.profileSkipped ? '' : this.companySize,
      referralSurveyId: this.args.onboardingSurvey.id,
    };
  }

  get recommendationReason() {
    return recommendationReason(this.preferences);
  }

  get recommendedCourse() {
    const available = this.args.courses.filter((course) => course.releaseStatus === 'live' && course.visibility === 'public');
    const preferred = recommendedCourseSlugs(this.preferences);

    return (
      preferred.map((slug) => available.find((course) => course.slug === slug)).find(Boolean) ||
      available.find((course) => course.slug === 'redis') ||
      available[0]
    );
  }

  @action
  back() {
    if (!this.isSaving) {
      this.saveError = null;
      this.currentStep--;
    }
  }

  @action
  clearField(field: 'role' | 'experience' | 'companySize', event: Event) {
    this[field] = '';
    (event.currentTarget as HTMLElement).closest('fieldset')?.querySelector('input')?.focus();
  }

  @action
  @waitFor
  async continue(event: Event) {
    event.preventDefault();

    if (this.isSaving) return;

    if (this.currentStep === 1) {
      await this.saveGoal();
    } else {
      this.profileSkipped = false;
      await this.finish();
    }
  }

  @action
  @waitFor
  async finish() {
    if (this.isSaving) {
      return;
    }

    this.isSaving = true;
    this.saveError = null;
    const survey = this.args.onboardingSurvey;
    const properties = {
      schema_version: 1,
      onboarding_survey_id: survey.id,
      usage_purpose: survey.selectedOptionsForUsagePurpose[0] || (survey.freeFormAnswerForUsagePurpose.trim() ? 'Other' : null),
      usage_purpose_other: survey.freeFormAnswerForUsagePurpose.trim() || null,
      role: this.profileSkipped ? null : this.role || null,
      role_other: !this.profileSkipped && this.role === 'Other' ? this.otherRole.trim() || null : null,
      professional_programming_years: this.profileSkipped ? null : this.experience || null,
      company_size: this.profileSkipped ? null : this.companySize || null,
      profile_skipped: this.profileSkipped,
      referral_source: survey.selectedOptionsForReferralSource[0] || null,
      referral_source_other: survey.selectedOptionsForReferralSource[0] === 'Other' ? survey.freeFormAnswerForReferralSource.trim() || null : null,
      recommended_course_slug: this.profileSkipped ? null : this.recommendedCourse?.slug || null,
    };
    const snapshot = JSON.stringify(properties);

    try {
      // Use the existing server-backed analytics API for structured profile answers.
      if (snapshot !== this.savedProfileSnapshot) {
        await this.store.createRecord('analytics-event', { name: 'submitted_onboarding_profile', properties }).save();
        this.savedProfileSnapshot = snapshot;
      }

      const profileSuggestion = this.authenticator.currentUser?.featureSuggestions.find(
        (suggestion) => suggestion.featureIsOnboardingProfile && !suggestion.isDismissed,
      );

      if (profileSuggestion) {
        try {
          await profileSuggestion.dismiss();
        } catch (error) {
          profileSuggestion.dismissedAt = null;

          throw error;
        }
      }

      survey.status = 'complete';
      await survey.save();
    } catch {
      survey.status = 'incomplete';
      this.saveError = 'Your answers could not be saved. Please try again.';
      this.isSaving = false;

      return;
    }

    this.onboardingPreferences.save(this.preferences);
    this.args.onSurveyComplete();
  }

  @action
  focusHeading(element: HTMLElement) {
    element.focus({ preventScroll: true });
    scrollToTop();
  }

  private async saveGoal() {
    this.isSaving = true;
    this.saveError = null;

    try {
      await this.args.onboardingSurvey.save();
      this.currentStep = 2;
    } catch {
      this.saveError = 'Your answer could not be saved. Please try again.';
    } finally {
      this.isSaving = false;
    }
  }

  @action
  selectCompanySize(event: Event) {
    this.companySize = (event.target as HTMLInputElement).value;
  }

  @action
  selectExperience(event: Event) {
    this.experience = (event.target as HTMLInputElement).value;
  }

  @action
  selectGoal(event: Event) {
    this.goal = (event.target as HTMLInputElement).value;
    this.args.onboardingSurvey.selectedOptionsForUsagePurpose = this.goal === 'other' ? [] : [this.goal];

    if (this.goal !== 'other') {
      this.args.onboardingSurvey.freeFormAnswerForUsagePurpose = '';
    }

    this.saveError = null;
  }

  @action
  selectRole(event: Event) {
    this.role = (event.target as HTMLInputElement).value;
  }

  @action
  @waitFor
  async skipGoal() {
    if (this.isSaving) return;
    this.goal = '';
    this.args.onboardingSurvey.selectedOptionsForUsagePurpose = [];
    this.args.onboardingSurvey.freeFormAnswerForUsagePurpose = '';
    await this.saveGoal();
  }

  @action
  @waitFor
  async skipProfile() {
    if (this.isSaving) return;
    this.profileSkipped = true;
    await this.finish();
  }

  @action
  updateGoalText(event: Event) {
    this.args.onboardingSurvey.freeFormAnswerForUsagePurpose = (event.target as HTMLTextAreaElement).value;
  }

  @action
  updateOtherRole(event: Event) {
    this.otherRole = (event.target as HTMLInputElement).value;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'WelcomePage::OnboardingSurveyWizard': typeof OnboardingSurveyWizard;
  }
}
