import Service, { inject as service } from '@ember/service';
import { isEqual } from '@ember/utils';
import { action } from '@ember/object';

export default class PageViewTracker extends Service {
  @service analyticsEventTracker;
  @service router;

  @action
  handleRouteChange(transition) {
    if (this.#shouldIgnoreEventForTransition(transition)) {
      return;
    }

    this.analyticsEventTracker.track('viewed_page');
  }

  setupListener() {
    this.router.on('routeDidChange', this.handleRouteChange);
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

  willDestroy() {
    this.router.off('routeDidChange', this.handleRouteChange);
  }
}
