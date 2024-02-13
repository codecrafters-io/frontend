import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { later } from '@ember/runloop';
import config from 'codecrafters-frontend/config/environment';
import Component from '@glimmer/component';
import type RouterService from '@ember/routing/router-service';
import Store from 'ember-data/store';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    dropdownPosition?: string;
    placeholderText?: string;
    source: string;
    sourceMetadata?: Record<string, unknown>;
  };

  Blocks: {
    default: [{ isOpen: boolean; actions: { close: () => void } }];
  };
};

export default class FeedbackButtonComponent extends Component<Signature> {
  @service declare router: RouterService;
  @service declare store: Store;

  @tracked feedbackSubmission;
  @tracked isSaving = false;
  @tracked wasSaved = false;
  @tracked formElement: HTMLFormElement | null = null;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);

    this.feedbackSubmission = this.store.createRecord('site-feedback-submission');
  }

  get sentimentOptions() {
    return ['😍', '😃', '😕', '😭'];
  }

  @action
  async handleDidInsertFormElement(formElement: HTMLFormElement | null) {
    this.formElement = formElement;
  }

  @action
  async handleDropdownClosed() {
    if (this.wasSaved || this.isSaving) {
      this.isSaving = false;
      this.wasSaved = false;
      this.feedbackSubmission = this.store.createRecord('site-feedback-submission');
    }
  }

  @action
  async handleFormSubmit(event: SubmitEvent) {
    event.preventDefault();
    this.formElement!.reportValidity();
  }

  get sendButtonIsDisabled() {
    return !this.feedbackSubmission.selectedSentiment || this.isSaving;
  }

  @action
  async handleSendButtonClick(dd: { isOpen: boolean; actions: { close: () => void } }) {
    this.formElement!.reportValidity();

    if (this.formElement!.checkValidity()) {
      this.isSaving = true;
      this.feedbackSubmission.pageUrl = window.location.href;
      this.feedbackSubmission.source = this.args.source;
      this.feedbackSubmission.sourceMetadata = this.args.sourceMetadata ?? {};

      await this.feedbackSubmission.save();
      this.isSaving = false;
      this.wasSaved = true;

      // Avoid timers in tests
      if (config.environment !== 'test') {
        later(() => {
          if (dd.isOpen) {
            dd.actions.close();
          }
        }, 5000);
      }
    }
  }

  @action
  handleSentimentOptionSelected(sentimentOption: string) {
    this.feedbackSubmission.selectedSentiment = sentimentOption;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    FeedbackButton: typeof FeedbackButtonComponent;
  }
}
