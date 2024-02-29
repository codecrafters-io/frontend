import Model, { attr, belongsTo } from '@ember-data/model';
import type TeamModel from './team';
import type UserModel from './user';

export default class TeamPaymentMethod extends Model {
  @attr('date') declare createdAt: Date;
  @belongsTo('user', { async: false, inverse: null }) declare creator: UserModel;
  @belongsTo('team', { async: false, inverse: 'paymentMethods' }) declare team: TeamModel;
}
