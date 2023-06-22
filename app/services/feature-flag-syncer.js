import Service, { inject as service } from '@ember/service';
import config from 'codecrafters-frontend/config/environment';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class FeatureFlagSyncer extends Service {
  @service authenticator;
  @service router;
  @tracked lastSyncedAt = null;

  @action
  handleRouteChange() {
    if (config.environment === 'test') {
      return;
    }

    if (this.lastSyncedAt && new Date() - this.lastSyncedAt < 10_000) {
      return;
    }

    if (this.authenticator.currentUser) {
      this.authenticator.currentUser.syncFeatureFlags();
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
