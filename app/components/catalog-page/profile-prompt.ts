import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { waitFor } from '@ember/test-waiters';
import type Store from '@ember-data/store';
import type FeatureSuggestionModel from 'codecrafters-frontend/models/feature-suggestion';
import type OnboardingSurveyModel from 'codecrafters-frontend/models/onboarding-survey';
import { roles, experienceRanges, companySizes } from 'codecrafters-frontend/utils/onboarding-profile-options';
import type OnboardingPreferencesService from 'codecrafters-frontend/services/onboarding-preferences';
import { onboardingGoals } from 'codecrafters-frontend/utils/onboarding-recommendations';
import scrollToTop from 'codecrafters-frontend/utils/scroll-to-top';

interface Signature {
  Args: {
    featureSuggestion?: FeatureSuggestionModel;
    onboardingSurvey?: OnboardingSurveyModel | null;
  };
  Blocks: { default: [] };
}

export default class CatalogProfilePrompt extends Component<Signature> {
  @service declare store: Store;
  @service declare onboardingPreferences: OnboardingPreferencesService;
  @tracked isEditing = false;
  @tracked goal = '';
  @tracked isExpanded = false;
  @tracked isSaving = false;
  @tracked saveError: string | null = null;
  @tracked role = '';
  @tracked otherRole = '';
  @tracked experience = '';
  @tracked companySize = '';
  @tracked statusMessage = '';
  goals = onboardingGoals;
  roles = roles;
  experienceRanges = experienceRanges;
  companySizes = companySizes;
  private savedProfileSnapshot: string | null = null;

  get hasPreferences() {
    return !!this.onboardingPreferences.preferences;
  }

  get isVisible() {
    return (
      this.isEditing ||
      (this.args.onboardingSurvey !== undefined && !!this.args.featureSuggestion && (!this.args.featureSuggestion.isDismissed || this.isSaving))
    );
  }

  get saveIsDisabled() {
    return this.isSaving;
  }

  get shouldResumeOnboarding() {
    return this.args.onboardingSurvey?.status === 'incomplete';
  }

  @action
  clearField(field: 'role' | 'experience' | 'companySize', event: Event) {
    this[field] = '';
    (event.currentTarget as HTMLElement).closest('fieldset')?.querySelector('input')?.focus();
  }

  @action
  @waitFor
  async dismiss() {
    if (this.isSaving) return;

    if (this.isEditing) {
      this.isEditing = false;
      this.isExpanded = false;
      this.saveError = null;

      return;
    }

    if (!this.args.featureSuggestion) return;

    this.isSaving = true;
    this.saveError = null;

    try {
      await this.dismissSuggestion();
      this.statusMessage = 'Profile invitation dismissed.';
    } catch {
      this.saveError = 'This could not be dismissed. Please try again.';
    } finally {
      this.isSaving = false;
    }
  }

  private async dismissSuggestion() {
    const suggestion = this.args.featureSuggestion!;
    const previousDismissedAt = suggestion.dismissedAt;

    try {
      await suggestion.dismiss();
    } catch (error) {
      suggestion.dismissedAt = previousDismissedAt;

      throw error;
    }
  }

  @action
  editPreferences() {
    this.isEditing = true;
    this.expand();
  }

  @action
  expand() {
    const preferences = this.onboardingPreferences.preferences;
    this.goal = preferences?.goal ?? this.args.onboardingSurvey?.selectedOptionsForUsagePurpose[0] ?? '';
    this.role = preferences?.role || '';
    this.experience = preferences?.experience || '';
    this.companySize = preferences?.companySize || '';
    this.isExpanded = true;
    this.saveError = null;
  }

  @action
  focusForm(element: HTMLElement) {
    element.focus({ preventScroll: true });
  }

  @action
  @waitFor
  async save(event: Event) {
    event.preventDefault();

    if (this.saveIsDisabled) {
      return;
    }

    this.isSaving = true;
    this.saveError = null;
    const properties = {
      schema_version: 1,
      source: this.isEditing ? 'catalog_preferences' : 'catalog_profile_prompt',
      feature_suggestion_id: this.args.featureSuggestion?.id || null,
      onboarding_survey_id: this.args.onboardingSurvey?.id || null,
      role: this.role || null,
      role_other: this.role === 'Other' ? this.otherRole.trim() || null : null,
      professional_programming_years: this.experience || null,
      company_size: this.companySize || null,
      profile_skipped: false,
      usage_purpose: this.goal || null,
    };
    const snapshot = JSON.stringify(properties);

    try {
      if (snapshot !== this.savedProfileSnapshot) {
        await this.store.createRecord('analytics-event', { name: 'submitted_onboarding_profile', properties }).save();
        this.savedProfileSnapshot = snapshot;
      }

      if (this.args.featureSuggestion && !this.args.featureSuggestion.isDismissed) await this.dismissSuggestion();
      this.onboardingPreferences.save({
        goal: this.goal,
        role: this.role,
        experience: this.experience,
        companySize: this.companySize,
        referralSurveyId: this.onboardingPreferences.preferences?.referralSurveyId || null,
      });
      this.isEditing = false;
      this.isExpanded = false;
      this.statusMessage = 'Your preferences have been updated.';
      scrollToTop();
    } catch {
      this.saveError = 'Your answers could not be saved. Please try again.';
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
  }

  @action
  selectRole(event: Event) {
    this.role = (event.target as HTMLInputElement).value;
  }

  @action
  updateOtherRole(event: Event) {
    this.otherRole = (event.target as HTMLInputElement).value;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CatalogPage::ProfilePrompt': typeof CatalogProfilePrompt;
  }
}
