import Model from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';

export default class TeamSubscriptionModel extends Model {
  @belongsTo('team', { async: false }) team;
  @attr('date') endedAt;
  @attr('boolean') isLegacy;
  @attr('date') startDate;

  get isActive() {
    return !this.endedAt && !this.isNew;
  }
}
