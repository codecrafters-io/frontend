import Model from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';

export default class TeamSubscriptionModel extends Model {
  @belongsTo('team', { async: false, inverse: 'subscriptions' }) team;
  @attr('date') endedAt;
  @attr('date') startDate;

  get isActive() {
    return !this.endedAt && !this.isNew;
  }
}
