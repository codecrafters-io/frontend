import Component from '@glimmer/component';
import { action } from '@ember/object';
import { debounce } from '@ember/runloop';
import type TeamPaymentFlowModel from 'codecrafters-frontend/models/team-payment-flow';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    teamPaymentFlow: TeamPaymentFlowModel;
    onContinueButtonClick: () => void;
    isComplete?: boolean;
  };
}

export default class TeamDetailsForm extends Component<Signature> {
  declare formElement: HTMLFormElement;

  @action
  async handleDecrementSeatsButtonClick(event: Event) {
    event.preventDefault();

    if (this.args.teamPaymentFlow.numberOfSeats > 5) {
      this.args.teamPaymentFlow.numberOfSeats--;
      await this.handleValueUpdated();
    }
  }

  @action
  async handleDidInsertFormElement(formElement: HTMLFormElement) {
    this.formElement = formElement;
  }

  @action
  async handleFormSubmit(e: Event) {
    e.preventDefault();
    this.formElement.reportValidity();
  }

  @action
  async handleIncrementSeatsButtonClick(event: Event) {
    event.preventDefault();

    this.args.teamPaymentFlow.numberOfSeats++;
    await this.handleValueUpdated();
  }

  @action
  async handlePricingPlanTypeOptionSelected(newPricingPlanType: string) {
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
  async suppressEvent(event: Event) {
    event.preventDefault();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TeamPaymentPage::TeamDetailsStepContainer': typeof TeamDetailsForm;
  }
}
