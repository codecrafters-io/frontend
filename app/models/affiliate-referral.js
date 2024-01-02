import Model, { attr, belongsTo } from '@ember-data/model';

export default class AffiliateReferralModel extends Model {
  @belongsTo('user', { async: false, inverse: 'affiliateReferralsAsCustomer' }) customer;
  @belongsTo('user', { async: false, inverse: 'affiliateReferralsAsReferrer' }) referrer;
  @belongsTo('affiliate-link', { async: false, inverse: 'referrals' }) affiliateLink;

  @attr('date') activatedAt;
  @attr('string') status; // 'pending_trial', 'trialing', 'first_charge_successful', 'trial_cancelled', 'inactive'
  @attr('number') spentAmountInCents;
  @attr('number') upcomingPaymentAmountInCents;
  @attr('number') withdrawableEarningsAmountInCents;
  @attr('number') withheldEarningsAmountInCents;

  get discountPeriodEndsAt() {
    return new Date(this.activatedAt.getTime() + 3 * 24 * 60 * 60 * 1000);
  }

  get hasStartedTrial() {
    return this.statusIsTrialing || this.statusIsFirstChargeSuccessful || this.statusIsTrialCancelled;
  }

  get isWithinDiscountPeriod() {
    return this.discountPeriodEndsAt > new Date();
  }

  get spentAmountInDollars() {
    return this.spentAmountInCents / 100;
  }

  get statusIsFirstChargeSuccessful() {
    return this.status === 'first_charge_successful';
  }

  get statusIsInactive() {
    return this.status === 'inactive';
  }

  get statusIsPendingTrial() {
    return this.status === 'pending_trial';
  }

  get statusIsTrialCancelled() {
    return this.status === 'trial_cancelled';
  }

  get statusIsTrialing() {
    return this.status === 'trialing';
  }

  get totalEarningsAmountInCents() {
    return this.withdrawableEarningsAmountInCents + this.withheldEarningsAmountInCents;
  }

  get totalEarningsAmountInDollars() {
    return this.totalEarningsAmountInCents / 100;
  }

  get upcomingPaymentAmountInDollars() {
    return this.upcomingPaymentAmountInCents / 100;
  }
}
