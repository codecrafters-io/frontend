import Model, { attr, belongsTo } from '@ember-data/model';
import type TeamModel from './team';

export default class TeamPaymentMethodUpdateRequestModel extends Model {
  @belongsTo('team', { async: false, inverse: null }) declare team: TeamModel;
  @attr('string') declare url: string;
}
