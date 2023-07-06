import Service, { inject as service } from '@ember/service';
import { isEqual } from '@ember/utils';
import { action } from '@ember/object';

export default class PageViewTracker extends Service {
  @service router;
  @service store;
  @service utmCampaignIdTracker;

  @action
  handleRouteChange(transition) {
    if (this.#shouldIgnoreEventForTransition(transition)) {
      return;
    }

    this.#buildAnalyticsEvent().save();
  }

  setupListener() {
    this.router.on('routeDidChange', this.handleRouteChange);
  }

  willDestroy() {
    this.router.off('routeDidChange', this.handleRouteChange);
  }

  #buildAnalyticsEvent() {
    let baseURL = `${window.location.protocol}//${window.location.host}`; // 'https://app.codecrafters.io

    return this.store.createRecord('analytics-event', {
      name: 'viewed_page',
      properties: {
        utm_id: this.utmCampaignIdTracker.firstSeenCampaignId,
        url: `${baseURL}${this.router.currentURL}`,
      },
    });
  }

  #shouldIgnoreEventForTransition(transition) {
    if (transition.to && (transition.to.name === 'course-stage-solution.diff' || transition.to.name === 'course-stage-solution.explanation')) {
      return true; // These are covered by afterModel hooks
    }

    if (!transition.from || !transition.to) {
      return false; // First page load, not reason to ignore
    }

    if (transition.from.name !== transition.to.name) {
      return false;
    }

    if (!isEqual(transition.from.params, transition.to.params)) {
      return false;
    }

    // Route name & params are the same, only query params differ.
    return true;
  }
}
