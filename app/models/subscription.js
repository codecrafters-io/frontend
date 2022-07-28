import Model from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';

export default class SubscriptionModel extends Model {
  @belongsTo('user', { async: false }) user;
  @attr('date') endedAt;
  @attr('date') startDate;
  @attr('string') pricingPlanName;

  get isActive() {
    return !this.endedAt;
  }
}
