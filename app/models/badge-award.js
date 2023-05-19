import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

export default class BadgeAward extends Model {
  @belongsTo('badge', { async: false, inverse: null }) badge;
  @belongsTo('user', { async: false, inverse: null }) user;

  @attr('date') awardedAt;
  @attr('string') sourceId;
  @attr('string') sourceType;
}
