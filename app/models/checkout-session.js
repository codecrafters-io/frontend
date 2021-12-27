import Model from '@ember-data/model';
import { attr } from '@ember-data/model';

export default class CheckoutSessionModel extends Model {
  @attr('string') url;
}
