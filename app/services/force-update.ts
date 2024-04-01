import { action } from '@ember/object';
import Service, { service } from '@ember/service';
import type VersionService from './version';
import type RouterService from '@ember/routing/router-service';

export default class ForceUpdateService extends Service {
  @service declare router: RouterService;
  @service declare version: VersionService;

  @action
  handleRouteChange() {
    console.log('Route changed, checking for updates');
    this.version.fetchLatestVersionIfNeeded();
  }

  setupListener() {
    this.router.on('routeDidChange', this.handleRouteChange);
  }

  willDestroy() {
    this.router.off('routeDidChange', this.handleRouteChange);
  }
}
