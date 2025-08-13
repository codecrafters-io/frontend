import Model, { attr, belongsTo } from '@ember-data/model';
import type AffiliateLinkModel from './affiliate-link';
import type UserModel from './user';

export default class AffiliateReferralModel extends Model {
  @belongsTo('user', { async: false, inverse: 'affiliateReferralsAsCustomer' }) declare customer: UserModel;
  @belongsTo('user', { async: false, inverse: 'affiliateReferralsAsReferrer' }) declare referrer: UserModel;
  @belongsTo('affiliate-link', { async: false, inverse: 'referrals' }) declare affiliateLink: AffiliateLinkModel;

  @attr('date') declare activatedAt: Date;
  @attr('string') declare status: 'awaiting_first_charge' | 'first_charge_successful' | 'inactive';
  @attr('number') declare spentAmountInCents: number;
  @attr('number') declare withdrawableEarningsAmountInCents: number;
  @attr('number') declare withheldEarningsAmountInCents: number;

  get spentAmountInDollars() {
    return this.spentAmountInCents / 100;
  }

  get statusIsAwaitingFirstCharge() {
    return this.status === 'awaiting_first_charge';
  }

  get statusIsFirstChargeSuccessful() {
    return this.status === 'first_charge_successful';
  }

  get statusIsInactive() {
    return this.status === 'inactive';
  }

  get totalEarningsAmountInCents() {
    return this.withdrawableEarningsAmountInCents + this.withheldEarningsAmountInCents;
  }

  get totalEarningsAmountInDollars() {
    return this.totalEarningsAmountInCents / 100;
  }
}
