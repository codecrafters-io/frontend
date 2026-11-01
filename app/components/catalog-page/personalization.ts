import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { waitFor } from '@ember/test-waiters';
import type Store from '@ember-data/store';
import type CourseModel from 'codecrafters-frontend/models/course';
import type OnboardingSurveyModel from 'codecrafters-frontend/models/onboarding-survey';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type OnboardingPreferencesService from 'codecrafters-frontend/services/onboarding-preferences';
import { onboardingGoals, recommendationReason, referralSources } from 'codecrafters-frontend/utils/onboarding-recommendations';

interface Signature {
  Args: { course?: CourseModel };
}

export default class CatalogPersonalization extends Component<Signature> {
  @service declare store: Store;

  @service declare authenticator: AuthenticatorService;

  @service declare onboardingPreferences: OnboardingPreferencesService;

  @tracked referralIsExpanded = false;

  @tracked isSaving = false;

  @tracked referralSource = '';

  @tracked otherReferral = '';

  @tracked referralSaved = false;

  @tracked saveError: string | null = null;

  private survey: OnboardingSurveyModel | null = null;

  referralSources = referralSources;

  get conciseGuidance() {
    return ['5\u201310', '10+'].includes(this.preferences?.experience || '');
  }

  get preferences() {
    return this.onboardingPreferences.preferences;
  }

  get reason() {
    return recommendationReason(this.preferences);
  }

  get referralSaveIsDisabled() {
    return this.isSaving || !this.survey;
  }

  get summary() {
    const preferences = this.preferences;

    return [
      onboardingGoals.find((goal) => goal.value === preferences?.goal)?.title,
      preferences?.role,
      preferences?.experience ? `${preferences.experience} years professionally` : '',
    ].filter(Boolean);
  }

  @action
  @waitFor
  async saveReferral(event: Event) {
    event.preventDefault();
    if (this.isSaving || !this.survey) return;
    this.isSaving = true;
    this.saveError = null;

    try {
      this.survey.selectedOptionsForReferralSource = this.referralSource ? [this.referralSource] : [];
      this.survey.freeFormAnswerForReferralSource = this.referralSource === 'Other' ? this.otherReferral.trim() : '';
      await this.survey.save();
      this.referralSaved = true;
      this.referralIsExpanded = false;
    } catch {
      this.saveError = 'Your answer could not be saved. Please try again.';
    } finally {
      this.isSaving = false;
    }
  }

  @action
  selectReferral(event: Event) {
    this.referralSource = (event.target as HTMLInputElement).value;
  }

  @action
  @waitFor
  async toggleReferral() {
    if (this.isSaving) return;
    this.referralIsExpanded = !this.referralIsExpanded;
    if (!this.referralIsExpanded || this.survey?.id === this.preferences?.referralSurveyId) return;
    this.survey = null;
    this.referralSaved = false;
    this.isSaving = true;
    this.saveError = null;

    try {
      const id = this.preferences?.referralSurveyId;
      this.survey =
        (id ? this.store.peekRecord('onboarding-survey', id) : null) ||
        ((await this.store.queryRecord('onboarding-survey', { user_id: this.authenticator.currentUserId })) as OnboardingSurveyModel | null);
      if (!this.survey) throw new Error('Onboarding survey unavailable');
      this.referralSource = this.survey.selectedOptionsForReferralSource[0] || '';
      this.otherReferral = this.survey.freeFormAnswerForReferralSource;
    } catch {
      this.saveError = 'This question could not be loaded. Close and reopen it to try again.';
    } finally {
      this.isSaving = false;
    }
  }

  @action
  updateOtherReferral(event: Event) {
    this.otherReferral = (event.target as HTMLInputElement).value;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CatalogPage::Personalization': typeof CatalogPersonalization;
  }
}
