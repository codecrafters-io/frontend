import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class PaymentPreview extends Component {
  @tracked firstInvoicePreview;
  @tracked isLoadingFirstInvoicePreview = true;
  @service store;

  constructor() {
    super(...arguments);
    this.loadFirstInvoicePreview();
  }

  get perUnitAmountInDollarsInFirstInvoicePreview() {
    return this.firstInvoicePreview.lineItems[0].amount_after_discounts / this.subscriptionQuantityInFirstInvoicePreview / 100;
  }

  get subscriptionQuantityInFirstInvoicePreview() {
    return this.firstInvoicePreview.lineItems[0].quantity;
  }

  @action
  async loadFirstInvoicePreview() {
    this.firstInvoicePreview = await this.args.teamPaymentFlow.fetchFirstInvoicePreview();
    this.isLoadingFirstInvoicePreview = false;
  }
}
