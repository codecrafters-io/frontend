import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { groupBy } from 'codecrafters-frontend/utils/lodash-utils';
import type UserModel from './user';
import type AffiliateReferralModel from './affiliate-referral';

export default class AffiliateLinkModel extends Model {
  @belongsTo('user', { async: false, inverse: 'affiliateLinks' }) declare user: UserModel;

  @hasMany('affiliate-referral', { async: false, inverse: 'affiliateLink' }) declare referrals: AffiliateReferralModel[];

  @attr('string') declare slug: string;
  @attr('string') declare url: string;
  @attr('number') declare uniqueViewerCount: number;

  get totalEarningsAmountInCents() {
    return this.referrals.reduce((sum, referral) => sum + referral.totalEarningsAmountInCents, 0);
  }

  get visibleReferrals(): AffiliateReferralModel[] {
    const referralsGroupedByCustomer: Record<string, AffiliateReferralModel[]> = groupBy(
      this.referrals,
      (referral: AffiliateReferralModel) => referral.customer.id,
    );

    return Object.values(referralsGroupedByCustomer)
      .map((referrals) => {
        return (referrals.find((referral) => !referral.statusIsInactive) || referrals[0]) as AffiliateReferralModel;
      })
      .sortBy('activatedAt')
      .reverse();
  }

  get withdrawableEarningsAmountInCents(): number {
    return this.referrals.reduce((sum, referral) => sum + referral.withdrawableEarningsAmountInCents, 0);
  }

  get withheldEarningsAmountInCents(): number {
    return this.referrals.reduce((sum, referral) => sum + referral.withheldEarningsAmountInCents, 0);
  }
}
