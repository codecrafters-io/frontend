import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { groupBy } from 'codecrafters-frontend/lib/lodash-utils';

export default class ReferralLinkModel extends Model {
  @belongsTo('user', { async: false }) user;

  @hasMany('referral-activation', { async: false }) activations;

  @attr('string') slug;
  @attr('string') url;
  @attr('number') uniqueViewerCount;

  get totalEarningsAmountInCents() {
    return this.activations.reduce((sum, activation) => sum + activation.totalEarningsAmountInCents, 0);
  }

  get visibleActivations() {
    return Object.values(groupBy(this.activations, (activation) => activation.customer.id))
      .map((activations) => {
        return activations.find((activation) => !activation.statusIsInactive) || activations[0];
      })
      .sortBy('activatedAt')
      .reverse();
  }

  get withdrawableEarningsAmountInCents() {
    return this.activations.reduce((sum, activation) => sum + activation.withdrawableEarningsAmountInCents, 0);
  }

  get withheldEarningsAmountInCents() {
    return this.activations.reduce((sum, activation) => sum + activation.withheldEarningsAmountInCents, 0);
  }
}
