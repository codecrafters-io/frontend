import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

export default class TeamPilotModel extends Model {
  @attr('date') endDate;
  @attr('boolean') requiresPaymentMethod;
  @belongsTo('team', { async: false, inverse: 'pilots' }) team;

  get isActive() {
    return new Date() < this.endDate;
  }

  // Note: This won't always be the exact opposite of isActive, since a pilot might not have started (we don't support these yet).
  get isExpired() {
    return new Date() >= this.endDate;
  }
}
