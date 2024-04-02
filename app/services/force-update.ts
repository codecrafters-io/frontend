import { action } from '@ember/object';
import Service, { service } from '@ember/service';
import type VersionTrackerService from './version-tracker';
import type RouterService from '@ember/routing/router-service';

export default class ForceUpdateService extends Service {
  @service declare router: RouterService;
  @service declare versionTracker: VersionTrackerService;

  @action
  async handleRouteChange() {
    await this.versionTracker.fetchLatestVersionIfNeeded();

    if (this.versionTracker.currentVersionIsIncompatible && this.router.currentRouteName !== 'update-required') {
      this.router.transitionTo('update-required', { queryParams: { next: `${this.router.currentURL}` } });
    }
  }

  setupListener() {
    this.router.on('routeDidChange', this.handleRouteChange);
  }

  willDestroy() {
    this.router.off('routeDidChange', this.handleRouteChange);
  }
}
