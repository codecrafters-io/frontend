import Service, { service } from '@ember/service';
import RouterService from '@ember/routing/router-service';
import FastBootService from 'ember-cli-fastboot/services/fastboot';
import Store from '@ember-data/store';
import * as Sentry from '@sentry/ember';

export default class AnalyticsEventTrackerService extends Service {
  @service declare store: Store;
  @service declare router: RouterService;
  @service declare fastboot: FastBootService;
  @service declare utmCampaignIdTracker: unknown;

  track(eventName: string, eventProperties: Record<string, unknown>): void {
    // Don't track any analytics during FastBoot runs
    if (this.fastboot.isFastBoot) {
      return;
    }

    const baseURL = `${window.location.protocol}//${window.location.host}`; // 'https://app.codecrafters.io

    const defaultProperties = {
      // @ts-expect-error utmCampaignIdTracker service not typed
      utm_id: this.utmCampaignIdTracker.firstSeenCampaignId,
      url: `${baseURL}${this.router.currentURL}`,
    };

    const mergedProperties = Object.assign(defaultProperties, eventProperties);

    Sentry.addBreadcrumb({
      category: 'analytics_events',
      message: `Event: ${eventName}. Properties: ${JSON.stringify(mergedProperties)}`,
      level: 'info',
    });

    this.store
      .createRecord('analytics-event', {
        name: eventName,
        properties: mergedProperties,
      })
      .save();
  }
}
