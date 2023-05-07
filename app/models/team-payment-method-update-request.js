import Model from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';

export default class TeamPaymentMethodUpdateRequestModel extends Model {
  @belongsTo('team', { async: false }) team;
  @attr('string') url;
}
