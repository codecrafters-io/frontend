import Model, { attr, belongsTo } from '@ember-data/model';
import type AffiliateLinkModel from './affiliate-link';
import type UserModel from './user';

export default class AffiliateReferralModel extends Model {
  @belongsTo('user', { async: false, inverse: 'affiliateReferralsAsCustomer' }) declare customer: UserModel;
  @belongsTo('user', { async: false, inverse: 'affiliateReferralsAsReferrer' }) declare referrer: UserModel;
  @belongsTo('affiliate-link', { async: false, inverse: 'referrals' }) declare affiliateLink: AffiliateLinkModel;

  @attr('date') declare activatedAt: Date;
  @attr('string') declare status: 'pending_trial' | 'trialing' | 'first_charge_successful' | 'trial_cancelled' | 'inactive';
  @attr('number') declare spentAmountInCents: number;
  @attr('number') declare upcomingPaymentAmountInCents: number;
  @attr('number') declare withdrawableEarningsAmountInCents: number;
  @attr('number') declare withheldEarningsAmountInCents: number;

  get hasStartedTrial() {
    return this.statusIsTrialing || this.statusIsFirstChargeSuccessful || this.statusIsTrialCancelled;
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
