import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { groupBy } from 'codecrafters-frontend/lib/lodash-utils';

export default class ReferralLinkModel extends Model {
  @belongsTo('user', { async: false }) user;

  @hasMany('referral-activation', { async: false }) activations;

  @attr('string') slug;
  @attr('string') url;
  @attr('number') uniqueViewerCount;

  get visibleActivations() {
    return Object.values(groupBy(this.activations, (activation) => activation.customer.id))
      .map((activations) => {
        return activations.find((activation) => !activation.statusIsInactive) || activations[0];
      })
      .sortBy('activatedAt')
      .reverse();
  }
}
