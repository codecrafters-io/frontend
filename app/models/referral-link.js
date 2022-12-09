import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class ReferralLinkModel extends Model {
  @belongsTo('user', { async: false }) user;

  @hasMany('referral-activation', { async: false }) activations;

  @attr('string') slug;
  @attr('string') url;
  @attr('number') uniqueViewerCount;

  get visibleActivations() {
    return this.activations.sortBy('activatedAt').reverse(); // All for now
  }
}
