import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { waitFor } from '@ember/test-waiters';
import type Store from '@ember-data/store';
import type FeatureSuggestionModel from 'codecrafters-frontend/models/feature-suggestion';
import type OnboardingSurveyModel from 'codecrafters-frontend/models/onboarding-survey';
import { roles, experienceRanges, companySizes } from 'codecrafters-frontend/utils/onboarding-profile-options';

interface Signature {
  Args: {
    featureSuggestion?: FeatureSuggestionModel;
    onboardingSurvey?: OnboardingSurveyModel | null;
  };
  Blocks: { default: [] };
}

export default class CatalogProfilePrompt extends Component<Signature> {
  @service declare store: Store;
  @tracked isExpanded = false;
  @tracked companyIsExpanded = false;
  @tracked isSaving = false;
  @tracked saveError: string | null = null;
  @tracked role = '';
  @tracked otherRole = '';
  @tracked experience = '';
  @tracked companySize = '';
  @tracked statusMessage = '';

  roles = roles;
  experienceRanges = experienceRanges;
  companySizes = companySizes;
  private savedProfileSnapshot: string | null = null;

  get isVisible() {
    return this.args.onboardingSurvey !== undefined && !!this.args.featureSuggestion && (!this.args.featureSuggestion.isDismissed || this.isSaving);
  }

  get saveIsDisabled() {
    return this.isSaving || !this.role || !this.experience || (this.role === 'Other' && !this.otherRole.trim());
  }

  get shouldResumeOnboarding() {
    return this.args.onboardingSurvey?.status === 'incomplete';
  }

  @action
  @waitFor
  async dismiss() {
    if (this.isSaving || !this.args.featureSuggestion) {
      return;
    }

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
  expand() {
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

    if (this.saveIsDisabled || !this.args.featureSuggestion) {
      return;
    }

    this.isSaving = true;
    this.saveError = null;
    const properties = {
      schema_version: 1,
      source: 'catalog_profile_prompt',
      feature_suggestion_id: this.args.featureSuggestion.id,
      onboarding_survey_id: this.args.onboardingSurvey?.id || null,
      role: this.role,
      role_other: this.role === 'Other' ? this.otherRole.trim() : null,
      professional_programming_years: this.experience,
      company_size: this.companySize || null,
      profile_skipped: false,
    };
    const snapshot = JSON.stringify(properties);

    try {
      if (snapshot !== this.savedProfileSnapshot) {
        await this.store.createRecord('analytics-event', { name: 'submitted_onboarding_profile', properties }).save();
        this.savedProfileSnapshot = snapshot;
      }

      await this.dismissSuggestion();
      this.statusMessage = 'Thanks. Your answers have been saved.';
    } catch {
      this.saveError = 'Your answers could not be saved. Please try again.';
    } finally {
      this.isSaving = false;
    }
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
  selectRole(event: Event) {
    this.role = (event.target as HTMLInputElement).value;
  }

  @action
  toggleCompany() {
    this.companyIsExpanded = !this.companyIsExpanded;
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
