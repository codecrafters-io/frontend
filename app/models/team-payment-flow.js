import { attr } from '@ember-data/model';
import { memberAction } from 'ember-api-actions';
import Model from '@ember-data/model';

export default class TeamPaymentFlowModel extends Model {
  @attr('string') teamName;
  @attr('string') contactEmailAddress;
  @attr('string') pricingPlanType; // monthly, yearly
  @attr('number') numberOfSeats;
  @attr('string') stripeSetupIntentClientSecret;
  @attr('string') stripeSetupIntentId;
  @attr('string') stripeSetupIntentStatus;
  @attr('string') teamSetupUrl;

  get contactEmailAddressIsComplete() {
    return this.contactEmailAddress && this.contactEmailAddress.trim().length > 0;
  }

  get teamNameIsComplete() {
    return this.teamName && this.teamName.trim().length > 0;
  }

  get numberOfSeatsIsComplete() {
    return this.numberOfSeats && this.numberOfSeats >= 5;
  }

  get paymentDetailsAreComplete() {
    return this.stripeSetupIntentStatus === 'succeeded';
  }

  get pricingPlanTypeIsComplete() {
    return ['monthly', 'yearly'].includes(this.pricingPlanType);
  }
}

TeamPaymentFlowModel.prototype.fetchFirstInvoicePreview = memberAction({
  path: 'first-invoice-preview',
  type: 'get',

  after(response) {
    this.store.pushPayload(response);

    return this.store.peekRecord('invoice', response.data.id);
  },
});

TeamPaymentFlowModel.prototype.attemptPayment = memberAction({
  path: 'attempt-payment',
  type: 'post',

  after(response) {
    return response;
  },
});

TeamPaymentFlowModel.prototype.resetPaymentDetails = memberAction({
  path: 'reset-payment-details',
  type: 'post',

  after(response) {
    this.store.pushPayload(response);
  },
});
