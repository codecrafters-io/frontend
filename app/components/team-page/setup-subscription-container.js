import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import window from 'ember-window-mock';
import Component from '@glimmer/component';

export default class SetupSubscriptionContainer extends Component {
  @service store;
  @tracked isCreatingSubscription = false;
  @tracked isCreatingPaymentMethodUpdateRequest = false;
  @tracked isLoadingFirstInvoicePreview = true;
  @tracked firstInvoicePreview;

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
  async handleAddPaymentMethodButtonClick() {
    this.isCreatingPaymentMethodUpdateRequest = true;
    const paymentMethodUpdateRequest = await this.store.createRecord('team-payment-method-update-request', { team: this.args.team }).save();
    window.location.href = paymentMethodUpdateRequest.url;
  }

  @action
  async handleStartSubscriptionButtonClick() {
    this.isCreatingSubscription = true;
    await this.store.createRecord('team-subscription', { team: this.args.team }).save();
    this.isCreatingSubscription = false;
  }

  @action
  async loadFirstInvoicePreview() {
    this.firstInvoicePreview = await this.args.team.fetchFirstInvoicePreview();
    this.isLoadingFirstInvoicePreview = false;
  }
}
