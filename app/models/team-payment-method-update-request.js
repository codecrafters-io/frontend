import Model from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';

export default class TeamPaymentMethodUpdateRequestModel extends Model {
  @belongsTo('team') team;
  @attr('string') url;
}
