import Service, { inject as service } from '@ember/service';
import { isEqual } from '@ember/utils';
import { action } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import type AnalyticsEventTrackerService from './analytics-event-tracker';
import type Transition from '@ember/routing/-private/transition';

interface RouteInfo {
  name: string;
  params: Record<string, unknown>;
  parent: RouteInfo | null;
}

export default class PageViewTracker extends Service {
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;
  @service declare router: RouterService;

  @action
  handleRouteChange(transition: Transition): void {
    if (this.#shouldIgnoreEventForTransition(transition)) {
      return;
    }

    this.analyticsEventTracker.track('viewed_page', {});
  }

  setupListener(): void {
    this.router.on('routeDidChange', this.handleRouteChange);
  }

  #shouldIgnoreEventForTransition(transition: { from: RouteInfo | null; to: RouteInfo | null }): boolean {
    if (!transition.from || !transition.to) {
      return false; // First page load, not reason to ignore
    }

    if (transition.from.name !== transition.to.name) {
      return false;
    }

    if (!isEqual(transition.from.params, transition.to.params)) {
      return false;
    }

    // Routes and params are the same, let's check if any of the parent routes has a different param.
    let currentFromParent = transition.from.parent;
    let currentToParent = transition.to.parent;

    while (currentFromParent && currentToParent) {
      if (!isEqual(currentFromParent.params, currentToParent.params)) {
        return false;
      }

      currentFromParent = currentFromParent.parent;
      currentToParent = currentToParent.parent;
    }

    // Route name & params are the same, parent params are same too, only query params must differ. Safe to ignore.
    return true;
  }

  willDestroy(): void {
    this.router.off('routeDidChange', this.handleRouteChange);
  }
}
