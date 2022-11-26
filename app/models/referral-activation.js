import Model, { attr, belongsTo } from '@ember-data/model';

export default class ReferralActivationModel extends Model {
  @belongsTo('user', { async: false, inverse: 'referralActivationsAsCustomer' }) customer;
  @belongsTo('user', { async: false }) referrer;
  @belongsTo('referral-link', { async: false }) referralLink;

  @attr('date') activatedAt;
  @attr('string') status; // 'pending_subscription', 'trialing', 'retrying_first_payment', 'first_payment_completed', 'cancelled' ?

  get discountPeriodEndsAt() {
    return new Date(this.activatedAt.getTime() + 3 * 24 * 60 * 60 * 1000);
  }

  get hasStartedTrial() {
    return this.statusIsTrialing || this.statusIsRetryingFirstPayment || this.statusIsFirstPaymentCompleted || this.statusIsCancelled;
  }

  get isWithinDiscountPeriod() {
    return this.discountPeriodEndsAt > new Date();
  }

  get statusIsCancelled() {
    return this.status === 'cancelled';
  }

  get statusIsPendingSubscription() {
    return this.status === 'pending_subscription';
  }

  get statusIsTrialing() {
    return this.status === 'trialing';
  }

  get statusIsRetryingFirstPayment() {
    return this.status === 'retrying_first_payment';
  }

  get statusIsFirstPaymentCompleted() {
    return this.status === 'first_payment_completed';
  }
}
