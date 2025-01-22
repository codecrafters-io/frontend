import Service, { inject as service } from '@ember/service';
import config from 'codecrafters-frontend/config/environment';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import type RouterService from '@ember/routing/router-service';
import type AuthenticatorService from './authenticator';

export default class FeatureFlagSyncer extends Service {
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;
  @tracked lastSyncedAt: Date | null = null;

  @action
  async handleRouteChange(): Promise<void> {
    if (config.environment === 'test') {
      return;
    }

    if (this.lastSyncedAt && new Date().getTime() - this.lastSyncedAt.getTime() < 10_000) {
      return;
    }

    await this.authenticator.authenticate();

    if (this.authenticator.currentUser) {
      await this.authenticator.currentUser.syncFeatureFlags({});
      this.lastSyncedAt = new Date();
    }
  }

  setupListener(): void {
    this.router.on('routeDidChange', this.handleRouteChange);
  }

  willDestroy(): void {
    this.router.off('routeDidChange', this.handleRouteChange);
  }
}
