import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

export default class BadgeAward extends Model {
  @belongsTo('badge', { async: false, inverse: null }) badge;
  @belongsTo('user', { async: false, inverse: null }) user;
  @belongsTo('submission', { async: false, inverse: null }) source; // This is actually polymorphic, but we don't have other sources at the moment

  @attr('date') awardedAt;
}
