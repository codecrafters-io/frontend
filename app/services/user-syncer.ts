import Service, { inject as service } from '@ember/service';
import config from 'codecrafters-frontend/config/environment';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import type AuthenticatorService from './authenticator';
import type RouterService from '@ember/routing/router';

export default class UserSyncer extends Service {
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;
  @tracked lastSyncedAt: Date | null = null;

  MIN_SYNC_INTERVAL_MS = 10_000;

  @action
  async handleRouteChange() {
    if (config.environment === 'test') {
      return;
    }

    if (this.lastSyncedAt && new Date().getTime() - this.lastSyncedAt.getTime() < this.MIN_SYNC_INTERVAL_MS) {
      return;
    }

    await this.authenticator.syncCurrentUser();

    if (this.authenticator.currentUser) {
      this.authenticator.syncCurrentUser();
      this.lastSyncedAt = new Date();
    }
  }

  setupListener() {
    this.router.on('routeDidChange', this.handleRouteChange);
  }

  willDestroy() {
    this.router.off('routeDidChange', this.handleRouteChange);
  }
}
