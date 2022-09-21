import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { loadStripe } from '@stripe/stripe-js';
import { tracked } from '@glimmer/tracking';

export default class TeamsPayController extends Controller {
  @service store;

  queryParams = [{ teamPaymentFlowId: 'f' }];

  @tracked selectedStep;

  constructor() {
    super(...arguments);

    // Trigger stripe loading as soon as page loads
    loadStripe('pk_test_51L1aPXJtewx3LJ9VgIiwpt4RL9FX2Yr7RgJCMMpviFmFc4Zrwt2s6lvH8QFMT88exOUvQWh13Thc7oBMVrMlQKwX00qbz9xH2A');
  }

  get currentStep() {
    return this.selectedStep || this.initialStep;
  }

  get initialStep() {
    if (this.isStep1Complete && this.isStep2Complete) {
      return 3;
    } else if (this.isStep1Complete) {
      return 2;
    } else {
      return 1;
    }
  }

  get completedSteps() {
    return [this.isStep1Complete ? 1 : null, this.isStep2Complete ? 2 : null, this.isStep3Complete ? 3 : null].compact();
  }

  get isStep1Complete() {
    return (
      this.model.teamNameIsComplete &&
      this.model.contactEmailAddressIsComplete &&
      this.model.pricingPlanTypeIsComplete &&
      this.model.numberOfSeatsIsComplete &&
      !this.model.isSaving &&
      !this.model.hasDirtyAttributes
    );
  }

  get isStep2Complete() {
    return this.isStep1Complete && this.model.paymentDetailsAreComplete;
  }

  get isStep3Complete() {
    return this.isStep1Complete && this.isStep2Complete && false;
  }

  @action
  handleContinueButtonClick() {
    if (this.completedSteps.includes(this.currentStep)) {
      this.selectedStep = this.currentStep + 1;
    }
  }

  @action
  handleNavigationItemClick(step) {
    if (step === 1 || this.completedSteps.includes(step - 1)) {
      this.selectedStep = step;
    }
  }
}
