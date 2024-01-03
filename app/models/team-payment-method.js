import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

export default class TeamPaymentMethod extends Model {
  @attr('date') createdAt;
  @belongsTo('user', { async: false, inverse: null }) creator;
  @belongsTo('team', { async: false, inverse: 'paymentMethods' }) team;
}
