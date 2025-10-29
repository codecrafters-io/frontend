import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import type UserModel from './user';
import type AffiliateReferralModel from './affiliate-referral';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';
import groupByFieldReductor from 'codecrafters-frontend/utils/group-by-field-reductor';

export default class AffiliateLinkModel extends Model {
  @belongsTo('user', { async: false, inverse: 'affiliateLinks' }) declare user: UserModel;

  @hasMany('affiliate-referral', { async: false, inverse: 'affiliateLink' }) declare referrals: AffiliateReferralModel[];

  @attr('string') declare slug: string;
  @attr('string') declare url: string;
  @attr('string') declare overriddenAffiliateUsername: string | null;
  @attr('string') declare overriddenAffiliateAvatarUrl: string | null;

  get avatarUrlForDisplay() {
    return this.overriddenAffiliateAvatarUrl || this.user.avatarUrl;
  }

  get totalEarningsAmountInCents() {
    return this.referrals.reduce((sum, referral) => sum + referral.totalEarningsAmountInCents, 0);
  }

  get usernameForDisplay() {
    return this.overriddenAffiliateUsername || this.user.username;
  }

  get visibleReferrals(): AffiliateReferralModel[] {
    const referralsGroupedByCustomer = this.referrals.reduce(
      groupByFieldReductor((referral) => referral.customer.id),
      {},
    );

    return Object.values(referralsGroupedByCustomer)
      .map((referrals) => {
        return (referrals.find((referral) => !referral.statusIsInactive) || referrals[0]) as AffiliateReferralModel;
      })
      .sort(fieldComparator('activatedAt'))
      .reverse();
  }

  get withdrawableEarningsAmountInCents(): number {
    return this.referrals.reduce((sum, referral) => sum + referral.withdrawableEarningsAmountInCents, 0);
  }

  get withheldEarningsAmountInCents(): number {
    return this.referrals.reduce((sum, referral) => sum + referral.withheldEarningsAmountInCents, 0);
  }
}
