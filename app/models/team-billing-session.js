import Model from '@ember-data/model';
import { attr } from '@ember-data/model';

export default class TeamBillingSessionModel extends Model {
  @attr('string') url;
}
