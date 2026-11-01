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

interface Signature {
  Args: {
    onboardingSurvey: OnboardingSurveyModel;
    courses: CourseModel[];
    hasNextDestination: boolean;
    onSurveyComplete: (destination: 'suggested' | 'catalog', courseSlug?: string) => void;
  };
  Element: HTMLDivElement;
}

export default class OnboardingSurveyWizard extends Component<Signature> {
  @service declare store: Store;
  @service declare authenticator: AuthenticatorService;
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
  @tracked companyIsExpanded = false;
  @tracked referralIsExpanded = false;

  wordmarkUrl = wordmarkDark;
  private savedProfileSnapshot: string | null = null;

  goals = [
    {
      value: 'Understand how systems work',
      title: 'Understand how systems work',
      description: 'Get inside the tools you use every day.',
      icon: 'server-outline',
      courseSlug: 'redis',
    },
    {
      value: 'Pick up a new language',
      title: 'Learn a new language',
      description: 'Put new syntax to work on a real project.',
      icon: 'code-outline',
      courseSlug: 'http-server',
    },
    {
      value: 'Master a language',
      title: 'Go deeper in my language',
      description: 'Move beyond the basics. Build with confidence.',
      icon: 'cube-transparent-outline',
      courseSlug: 'redis',
    },
    {
      value: 'Build portfolio projects',
      title: 'Build portfolio projects',
      description: 'Create something substantial from scratch.',
      icon: 'briefcase-outline',
      courseSlug: 'git',
    },
    {
      value: 'Interview prep',
      title: 'Prepare for interviews',
      description: 'Practice systems fundamentals by building.',
      icon: 'academic-cap-outline',
      courseSlug: 'redis',
    },
    {
      value: 'Not sure yet',
      title: 'Follow my curiosity',
      description: 'Explore, experiment, and see what clicks.',
      icon: 'beaker-outline',
      courseSlug: 'shell',
    },
  ];

  roles = roles;
  experienceRanges = experienceRanges;
  companySizes = companySizes;
  referralSources = [
    'YouTube',
    'GitHub',
    'Google',
    'Reddit',
    'Hacker News',
    'LinkedIn',
    'Twitter',
    'Instagram',
    'Facebook',
    'TikTok',
    'Friend/Colleague',
    'Newsletter',
    'Other',
    "Don't remember",
  ];

  steps = [
    { number: 1, title: 'Your goal', description: 'What you want to build toward' },
    { number: 2, title: 'A little about you', description: 'Your background and experience' },
    { number: 3, title: 'Your first build', description: 'A place to put curiosity to work' },
  ];

  get continueIsDisabled() {
    return this.isSaving || (this.currentStep === 1 ? this.goalIsInvalid : this.profileIsInvalid);
  }

  get goalIsInvalid() {
    return !this.goal || (this.goal === 'other' && !this.args.onboardingSurvey.freeFormAnswerForUsagePurpose.trim());
  }

  get profileIsInvalid() {
    return !this.role || !this.experience || (this.role === 'Other' && !this.otherRole.trim());
  }

  get recommendedCourse() {
    const available = this.args.courses.filter((course) => course.releaseStatus === 'live' && course.visibility === 'public');
    const desiredSlug = this.goals.find((goal) => goal.value === this.goal)?.courseSlug || 'http-server';

    return available.find((course) => course.slug === desiredSlug) || available.find((course) => course.slug === 'redis') || available[0];
  }

  get referralSource() {
    return (
      this.args.onboardingSurvey.selectedOptionsForReferralSource[0] ||
      (this.args.onboardingSurvey.freeFormAnswerForReferralSource.trim() ? 'Other' : '')
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
  @waitFor
  async continue(event: Event) {
    event.preventDefault();

    if (this.currentStep === 3 || this.continueIsDisabled) {
      return;
    }

    this.saveError = null;

    if (this.currentStep === 1) {
      this.isSaving = true;

      try {
        await this.args.onboardingSurvey.save();
        this.currentStep = 2;
      } catch {
        this.saveError = 'Your answer could not be saved. Please try again.';
      } finally {
        this.isSaving = false;
      }
    } else {
      this.profileSkipped = false;
      this.currentStep = 3;
    }
  }

  @action
  @waitFor
  async finish(destination: 'suggested' | 'catalog') {
    if (this.isSaving) {
      return;
    }

    this.isSaving = true;
    this.saveError = null;
    const survey = this.args.onboardingSurvey;
    const properties = {
      schema_version: 1,
      onboarding_survey_id: survey.id,
      usage_purpose: survey.selectedOptionsForUsagePurpose[0] || 'Other',
      usage_purpose_other: survey.freeFormAnswerForUsagePurpose.trim() || null,
      role: this.profileSkipped ? null : this.role,
      role_other: !this.profileSkipped && this.role === 'Other' ? this.otherRole.trim() : null,
      professional_programming_years: this.profileSkipped ? null : this.experience,
      company_size: this.profileSkipped ? null : this.companySize || null,
      profile_skipped: this.profileSkipped,
      referral_source: this.referralSource || null,
      referral_source_other: this.referralSource === 'Other' ? survey.freeFormAnswerForReferralSource.trim() || null : null,
      recommended_course_slug: this.recommendedCourse?.slug || null,
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

    this.args.onSurveyComplete(destination, this.recommendedCourse?.slug);
  }

  @action
  focusHeading(element: HTMLElement) {
    element.focus({ preventScroll: true });
    scrollToTop();
  }

  @action
  selectCompanySize(event: Event) {
    this.companySize = (event.target as HTMLSelectElement).value;
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
  selectReferral(event: Event) {
    this.args.onboardingSurvey.selectedOptionsForReferralSource = [(event.target as HTMLInputElement).value];

    if (this.referralSource !== 'Other') {
      this.args.onboardingSurvey.freeFormAnswerForReferralSource = '';
    }
  }

  @action
  selectRole(event: Event) {
    this.role = (event.target as HTMLInputElement).value;
  }

  @action
  skipProfile() {
    if (!this.isSaving) {
      this.profileSkipped = true;
      this.currentStep = 3;
    }
  }

  @action
  toggleCompany() {
    this.companyIsExpanded = !this.companyIsExpanded;
  }

  @action
  toggleReferral() {
    this.referralIsExpanded = !this.referralIsExpanded;
  }

  @action
  updateGoalText(event: Event) {
    this.args.onboardingSurvey.freeFormAnswerForUsagePurpose = (event.target as HTMLTextAreaElement).value;
  }

  @action
  updateOtherRole(event: Event) {
    this.otherRole = (event.target as HTMLInputElement).value;
  }

  @action
  updateReferralText(event: Event) {
    this.args.onboardingSurvey.freeFormAnswerForReferralSource = (event.target as HTMLInputElement).value;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'WelcomePage::OnboardingSurveyWizard': typeof OnboardingSurveyWizard;
  }
}
