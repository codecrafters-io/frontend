import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { groupBy } from 'codecrafters-frontend/utils/lodash-utils';
import type UserModel from './user';
import type AffiliateReferralModel from './affiliate-referral';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';

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
    const referralsGroupedByCustomer: Record<string, AffiliateReferralModel[]> = groupBy(
      this.referrals,
      (referral: AffiliateReferralModel) => referral.customer.id,
    );

    return Object.values(referralsGroupedByCustomer)
      .map((referrals) => {
        return (referrals.find((referral) => !referral.statusIsInactive) || referrals[0]) as AffiliateReferralModel;
      })
      .toSorted(fieldComparator('activatedAt'))
      .reverse();
  }

  get withdrawableEarningsAmountInCents(): number {
    return this.referrals.reduce((sum, referral) => sum + referral.withdrawableEarningsAmountInCents, 0);
  }

  get withheldEarningsAmountInCents(): number {
    return this.referrals.reduce((sum, referral) => sum + referral.withheldEarningsAmountInCents, 0);
  }
}
