import Model, { attr, belongsTo } from '@ember-data/model';
import type TeamModel from './team';

export default class TeamPilotModel extends Model {
  @belongsTo('team', { async: false, inverse: 'pilots' }) declare team: TeamModel;

  @attr('date') declare endDate: Date;
  @attr('boolean') declare requiresPaymentMethod: boolean;

  get isActive() {
    return new Date() < this.endDate;
  }

  // Note: This won't always be the exact opposite of isActive, since a pilot might not have started (we don't support these yet).
  get isExpired() {
    return new Date() >= this.endDate;
  }
}
