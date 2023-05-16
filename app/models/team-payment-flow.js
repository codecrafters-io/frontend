import { attr } from '@ember-data/model';
import { equal } from '@ember/object/computed'; // eslint-disable-line ember/no-computed-properties-in-native-classes
import { memberAction } from 'ember-api-actions';
import Model from '@ember-data/model';

export default class TeamPaymentFlowModel extends Model {
  @attr('boolean') couponCodeIsValid;
  @attr('boolean') couponCodeIsInvalid;
  @attr('string') teamName;
  @attr('string') contactEmailAddress;
  @attr('string') couponCode;
  @attr('string') pricingPlanType; // monthly, yearly
  @attr('number') numberOfSeats;
  @attr('string') stripeSetupIntentClientSecret;
  @attr('string') stripeSetupIntentId;
  @attr('string') stripeSetupIntentStatus;
  @attr('string') teamSetupUrl;

  @equal('pricingPlanType', 'monthly') pricingPlanTypeIsMonthly;
  @equal('pricingPlanType', 'yearly') pricingPlanTypeIsYearly;

  get contactEmailAddressIsComplete() {
    return this.contactEmailAddress && this.contactEmailAddress.trim().length > 0;
  }

  get hasCouponCode() {
    return this.couponCode && this.couponCode.trim().length > 0;
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

  get pricingFrequencyUnit() {
    return this.pricingPlanTypeIsMonthly ? 'mo' : 'yr';
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
