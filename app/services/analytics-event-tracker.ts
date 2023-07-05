import Service, { service } from '@ember/service';
import Store from '@ember-data/store';

export default class AnalyticsEventTrackerService extends Service {
  @service declare store: Store;

  track(eventName: string, eventProperties: Record<string, unknown>) {
    this.store
      .createRecord('analytics-event', {
        name: eventName,
        properties: eventProperties,
      })
      .save();
  }
}
