import Model from '@ember-data/model';
import { attr } from '@ember-data/model';

export default class IndividualBillingSessionModel extends Model {
  @attr('string') returnUrl;
  @attr('string') url;
}
