import Model, { attr } from '@ember-data/model';
import { equal } from '@ember/object/computed'; // eslint-disable-line ember/no-computed-properties-in-native-classes
import { memberAction } from 'ember-api-actions';
import type InvoiceModel from './invoice';

export default class TeamPaymentFlowModel extends Model {
  @attr('boolean') declare couponCodeIsValid: boolean;
  @attr('boolean') declare couponCodeIsInvalid: boolean;
  @attr('string') declare teamName: string;
  @attr('string') declare contactEmailAddress: string;
  @attr('string') declare couponCode: string;
  @attr('string') declare pricingPlanType: string; // monthly, yearly
  @attr('number') declare numberOfSeats: number;
  @attr('string') declare stripeSetupIntentClientSecret: string;
  @attr('string') declare stripeSetupIntentId: string;
  @attr('string') declare stripeSetupIntentStatus: string;
  @attr('string') declare teamSetupUrl: string;

  @equal('pricingPlanType', 'monthly') declare pricingPlanTypeIsMonthly: boolean;
  @equal('pricingPlanType', 'yearly') declare pricingPlanTypeIsYearly: boolean;

  get contactEmailAddressIsComplete() {
    return this.contactEmailAddress && this.contactEmailAddress.trim().length > 0;
  }

  get hasCouponCode() {
    return this.couponCode && this.couponCode.trim().length > 0;
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

  get teamNameIsComplete() {
    return this.teamName && this.teamName.trim().length > 0;
  }

  declare fetchFirstInvoicePreview: (this: Model, payload: unknown) => Promise<InvoiceModel>;
  declare attemptPayment: (this: Model, payload: unknown) => Promise<void>;
  declare resetPaymentDetails: (this: Model, payload: unknown) => Promise<void>;
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
