import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class TeamDetailsFormComponent extends Component {
  formElement;

  @action
  async handleDidInsertFormElement(formElement) {
    this.formElement = formElement;
  }

  @action
  async handleDecrementSeatsButtonClick() {
    if (this.args.teamPaymentFlow.numberOfSeats > 5) {
      this.args.teamPaymentFlow.numberOfSeats--;
      await this.handleValueUpdated();
    }
  }

  @action
  async handleIncrementSeatsButtonClick() {
    this.args.teamPaymentFlow.numberOfSeats++;
    await this.handleValueUpdated();
  }

  @action
  async handleFormSubmit(e) {
    e.preventDefault();
    this.formElement.reportValidity();
  }

  @action
  async handlePricingPlanTypeOptionSelected(newPricingPlanType) {
    this.args.teamPaymentFlow.pricingPlanType = newPricingPlanType;
    await this.handleValueUpdated();
  }

  @action
  async handleValueUpdated() {
    if (this.formElement.checkValidity()) {
      this.args.teamPaymentFlow.save();
    }
  }
}
