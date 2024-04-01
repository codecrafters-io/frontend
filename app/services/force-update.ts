import { action } from '@ember/object';
import Service, { service } from '@ember/service';
import type VersionTrackerService from './version-tracker';
import type RouterService from '@ember/routing/router-service';

export default class ForceUpdateService extends Service {
  @service declare router: RouterService;
  @service declare versionTracker: VersionTrackerService;

  @action
  handleRouteChange() {
    this.versionTracker.fetchLatestVersionIfNeeded();

    // TODO: Do something when the version is outdated?
  }

  setupListener() {
    this.router.on('routeDidChange', this.handleRouteChange);
  }

  willDestroy() {
    this.router.off('routeDidChange', this.handleRouteChange);
  }
}
