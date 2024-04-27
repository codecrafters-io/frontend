import Model from '@ember-data/model';
import { attr } from '@ember-data/model';

export default class AnalyticsEvent extends Model {
  @attr('string') declare name: string;
  @attr() declare properties: { key: string; value: string };
}
