import Model, { attr, belongsTo } from '@ember-data/model';

export default class ReferralLinkModel extends Model {
  @belongsTo('user', { async: false }) user;

  @attr('string') slug;
  @attr('string') url;
}
