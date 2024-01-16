import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { later } from '@ember/runloop';
import config from 'codecrafters-frontend/config/environment';
import Component from '@glimmer/component';

export default class FeedbackComponent extends Component {
  @service router;
  @service store;
  @tracked feedbackSubmission;
  @tracked isSaving = false;
  @tracked wasSaved = false;
  @tracked formElement;

  constructor() {
    super(...arguments);

    this.feedbackSubmission = this.store.createRecord('site-feedback-submission');
  }

  get sentimentOptions() {
    return ['😍', '😃', '😕', '😭'];
  }

  @action
  async handleDidInsertFormElement(formElement) {
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
  async handleFormSubmit(e) {
    e.preventDefault();
    this.formElement.reportValidity();
  }

  @action
  async handleSendButtonClick(dd) {
    this.formElement.reportValidity();

    if (this.formElement.checkValidity()) {
      this.isSaving = true;
      this.feedbackSubmission.pageUrl = window.location.href;
      // source will be passed as an argument to the component.
      this.feedbackSubmission.source = this.args.source;

      if (!this.feedbackSubmission.sourceMetadata) {
        this.feedbackSubmission.sourceMetadata = {};
      } else {
        this.feedbackSubmission.sourceMetadata = this.args.sourceMetadata;
      }

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
  handleSentimentOptionSelected(sentimentOption) {
    this.feedbackSubmission.selectedSentiment = sentimentOption;
  }
}
