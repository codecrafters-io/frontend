import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class ReviewPaymentStepContainer extends Component {
  @tracked errorMessage;
  @tracked firstInvoicePreview;
  @tracked isAttemptingPayment = false;
  @tracked isLoadingFirstInvoicePreview = true;
  @service store;

  constructor() {
    super(...arguments);
    this.loadFirstInvoicePreview();
  }

  @action
  async handleContinueButtonClick() {
    this.errorMessage = null;
    this.isAttemptingPayment = true;

    let response = await this.args.teamPaymentFlow.attemptPayment();
    this.isAttemptingPayment = false;

    if (response.error) {
      this.errorMessage = response.error;
    } else {
      this.store.pushPayload(response);
    }
  }

  @action
  async loadFirstInvoicePreview() {
    this.firstInvoicePreview = await this.args.teamPaymentFlow.fetchFirstInvoicePreview();
    this.isLoadingFirstInvoicePreview = false;
  }

  get subscriptionQuantityInFirstInvoicePreview() {
    return this.firstInvoicePreview.lineItems[0].quantity;
  }

  get perUnitAmountInDollarsInFirstInvoicePreview() {
    return this.firstInvoicePreview.lineItems[0].amount_after_discounts / this.subscriptionQuantityInFirstInvoicePreview / 100;
  }
}
