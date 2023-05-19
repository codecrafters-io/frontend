import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

export default class BadgeAward extends Model {
  @belongsTo('badge', { async: false, inverse: null }) badge;
  @belongsTo('user', { async: false, inverse: 'badgeAwards' }) user;

  @belongsTo('submission', { async: false, inverse: null }) submission; // This is actually polymorphic

  @attr('date') awardedAt;
}
