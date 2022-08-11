import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

export default class TeamPilotModel extends Model {
  @attr('date') endDate;
  @attr('boolean') requiresPaymentMethod;
  @belongsTo('team', { async: false }) team;
}
