import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

export default class FreeUsageRestriction extends Model {
  @attr('date') createdAt;
  @attr('date') expiresAt;
  @belongsTo('user', { async: false }) user;

  get isActive() {
    return this.expiresAt > new Date();
  }

  get isExpired() {
    return !this.isActive;
  }
}
