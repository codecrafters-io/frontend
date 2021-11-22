import Model from '@ember-data/model';
import { attr, belongsTo } from '@ember-data/model';

export default class CheckoutSessionModel extends Model {
  @attr('string') url;
}
