import { attr } from '@ember-data/model';
import { memberAction } from 'ember-api-actions';
import Model from '@ember-data/model';

export default class TeamPaymentFlowModel extends Model {
  @attr('string') teamName;
  @attr('string') contactEmailAddress;
  @attr('string') pricingPlanType; // per_seat, per_user
  @attr('number') numberOfSeats;
  @attr('string') stripePublishableKey;
  @attr('string') stripeSetupIntentClientSecret;
  @attr('string') stripeSetupIntentId;
  @attr('string') stripeSetupIntentStatus;

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
    return ['per_seat', 'per_user'].includes(this.pricingPlanType);
  }
}

TeamPaymentFlowModel.prototype.attemptPayment = memberAction({
  path: 'attempt-payment',
  type: 'post',

  after(response) {
    return response;
  },
});
