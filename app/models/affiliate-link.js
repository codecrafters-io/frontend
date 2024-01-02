import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { groupBy } from 'codecrafters-frontend/utils/lodash-utils';

export default class AffiliateLinkModel extends Model {
  @belongsTo('user', { async: false, inverse: 'affiliateLinks' }) user;

  @hasMany('affiliate-referral', { async: false, inverse: 'affiliateLink' }) referrals;

  @attr('string') slug;
  @attr('string') url;
  @attr('number') uniqueViewerCount;

  get totalEarningsAmountInCents() {
    return this.referrals.reduce((sum, referral) => sum + referral.totalEarningsAmountInCents, 0);
  }

  get visibleReferrals() {
    return Object.values(groupBy(this.referrals, (referral) => referral.customer.id))
      .map((referrals) => {
        return referrals.find((referral) => !referral.statusIsInactive) || referrals[0];
      })
      .sortBy('activatedAt')
      .reverse();
  }

  get withdrawableEarningsAmountInCents() {
    return this.referrals.reduce((sum, referral) => sum + referral.withdrawableEarningsAmountInCents, 0);
  }

  get withheldEarningsAmountInCents() {
    return this.referrals.reduce((sum, referral) => sum + referral.withheldEarningsAmountInCents, 0);
  }
}
