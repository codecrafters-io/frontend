import Model from '@ember-data/model';
import { attr } from '@ember-data/model';

export default class IndividualCheckoutSessionModel extends Model {
  @attr('string') url;
}
