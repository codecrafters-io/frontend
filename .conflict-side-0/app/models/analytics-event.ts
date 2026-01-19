import Model, { attr } from '@ember-data/model';

export default class AnalyticsEvent extends Model {
  @attr('string') declare name: string;
  @attr() declare properties: Record<string, unknown>;
}
