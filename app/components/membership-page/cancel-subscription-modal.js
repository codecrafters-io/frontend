import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

export default class CancelSubscriptionModalComponent extends Component {
  @tracked reasonDescriptionInputElement = null;
  @tracked selectedReason;
  @tracked otherReasonIsSelected;
  @tracked reasonDescription = '';
  @tracked isCancelling;
  @service store;

  constructor() {
    super(...arguments);

    this.subscription = this.args.subscription; // Save, so that when it is cancelled, values don't shift around
  }

  get cancelButtonIsEnabled() {
    return this.selectedReason || (this.otherReasonIsSelected && this.reasonDescription.length > 0);
  }

  get cancellationIsWithinTrialPeriod() {
    return this.subscription.isTrialing;
  }

  get placeholderTextForReasonDescriptionInput() {
    if (this.otherReasonIsSelected) {
      return 'Please enter the reason here. We read and respond to every message.';
    } else {
      return 'Any other feedback? We read and respond to every message written here.';
    }
  }

  get suggestedReasons() {
    return ['Quality was less than expected', 'I need more content', 'I no longer need it', "It's too expensive"];
  }

  @action
  async handleCancelSubscriptionButtonClick() {
    if (!this.isCancelling && this.cancelButtonIsEnabled) {
      this.isCancelling = true;

      if (this.cancellationIsWithinTrialPeriod) {
        await this.subscription.cancelTrial({
          'selected-reason': this.otherReasonIsSelected ? 'Other Reason' : this.selectedReason,
          'reason-description': this.reasonDescription,
        });
      } else {
        await this.subscription.cancel({
          'selected-reason': this.otherReasonIsSelected ? 'Other Reason' : this.selectedReason,
          'reason-description': this.reasonDescription,
        });
      }

      this.args.onClose();
    }
  }

  @action
  handleDidInsertReasonDescriptionInputElement(element) {
    this.reasonDescriptionInputElement = element;
  }

  @action
  handleOtherReasonSelect() {
    this.selectedReason = null;
    this.otherReasonIsSelected = true;
    this.reasonDescriptionInputElement.focus();
  }

  @action
  handleSuggestedReasonSelect(reason) {
    this.selectedReason = reason;
    this.otherReasonIsSelected = false;
  }
}
