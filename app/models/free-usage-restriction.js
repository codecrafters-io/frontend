import Model from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';

export default class FreeUsageRestrictionModel extends Model {
  @belongsTo('user', { async: false }) user;
  @attr('date') createdAt;
  @attr('date') expiresAt;

  get isActive() {
    return new Date() <= this.expiresAt;
  }
}
