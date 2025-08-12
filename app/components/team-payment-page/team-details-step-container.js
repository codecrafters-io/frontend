import Component from '@glimmer/component';
import { action } from '@ember/object';
import { debounce } from '@ember/runloop';

export default class TeamDetailsForm extends Component {
  formElement;

  @action
  async handleDecrementSeatsButtonClick(event) {
    event.preventDefault();

    if (this.args.teamPaymentFlow.numberOfSeats > 5) {
      this.args.teamPaymentFlow.numberOfSeats--;
      await this.handleValueUpdated();
    }
  }

  @action
  async handleDidInsertFormElement(formElement) {
    this.formElement = formElement;
  }

  @action
  async handleFormSubmit(e) {
    e.preventDefault();
    this.formElement.reportValidity();
  }

  @action
  async handleIncrementSeatsButtonClick(event) {
    event.preventDefault();

    this.args.teamPaymentFlow.numberOfSeats++;
    await this.handleValueUpdated();
  }

  @action
  async handlePricingPlanTypeOptionSelected(newPricingPlanType) {
    this.args.teamPaymentFlow.pricingPlanType = newPricingPlanType;
    await this.handleValueUpdated();
  }

  @action
  async handleValueUpdated() {
    if (this.args.teamPaymentFlow.hasCouponCode) {
      this.args.teamPaymentFlow.couponCode = this.args.teamPaymentFlow.couponCode.trim();
    }

    if (this.formElement.checkValidity()) {
      debounce(this, this.saveTeamPaymentFlow, 500);
    }
  }

  async saveTeamPaymentFlow() {
    this.args.teamPaymentFlow.save();
  }

  @action
  async suppressEvent(event) {
    event.preventDefault();
  }
}
