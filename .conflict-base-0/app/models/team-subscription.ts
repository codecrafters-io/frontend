import Model, { attr, belongsTo } from '@ember-data/model';
import type TeamModel from './team';

export default class TeamSubscriptionModel extends Model {
  @belongsTo('team', { async: false, inverse: 'subscriptions' }) declare team: TeamModel;
  @attr('date') declare endedAt: Date | null;
  @attr('date') declare startDate: Date;

  get isActive() {
    return !this.endedAt && !this.isNew;
  }
}
