import Model, { attr, belongsTo } from '@ember-data/model';

export default class ReferralActivationModel extends Model {
  @belongsTo('user', { async: false, inverse: 'referralActivationsAsCustomer' }) customer;
  @belongsTo('user', { async: false, inverse: 'referralActivationsAsReferrer' }) referrer;
  @belongsTo('referral-link', { async: false }) referralLink;

  @attr('date') activatedAt;
  @attr('string') status; // 'pending_trial', 'trialing', 'retrying_first_payment', 'first_payment_successful', 'cancelled' ?

  get discountPeriodEndsAt() {
    return new Date(this.activatedAt.getTime() + 3 * 24 * 60 * 60 * 1000);
  }

  get hasStartedTrial() {
    return this.statusIsTrialing || this.statusIsRetryingFirstPayment || this.statusIsFirstPaymentSuccessful || this.statusIsCancelled;
  }

  get isWithinDiscountPeriod() {
    return this.discountPeriodEndsAt > new Date();
  }

  get statusIsCancelled() {
    return this.status === 'cancelled';
  }

  get statusIsPendingTrial() {
    return this.status === 'pending_trial';
  }

  get statusIsTrialing() {
    return this.status === 'trialing';
  }

  get statusIsRetryingFirstPayment() {
    return this.status === 'retrying_first_payment';
  }

  get statusIsFirstPaymentSuccessful() {
    return this.status === 'first_payment_successful';
  }
}
