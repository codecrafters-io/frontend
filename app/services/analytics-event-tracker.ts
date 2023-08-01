import Service, { service } from '@ember/service';
import RouterService from '@ember/routing/router-service';
import Store from '@ember-data/store';

export default class AnalyticsEventTrackerService extends Service {
  @service declare store: Store;
  @service declare router: RouterService;
  @service utmCampaignIdTracker: unknown;

  track(eventName: string, eventProperties: Record<string, unknown>) {
    const baseURL = `${window.location.protocol}//${window.location.host}`; // 'https://app.codecrafters.io

    const defaultProperties = {
      // @ts-ignore
      utm_id: this.utmCampaignIdTracker.firstSeenCampaignId,
      url: `${baseURL}${this.router.currentURL}`,
    };

    const mergedProperties = Object.assign(defaultProperties,  eventProperties);

    this.store
      .createRecord('analytics-event', {
        name: eventName,
        properties: mergedProperties,
      })
      .save();
  }
}
