import Service, { service } from '@ember/service';
import VersionTrackerService from './version-tracker';
import config from 'codecrafters-frontend/config/environment';
import type RouterService from '@ember/routing/router-service';
import { action } from '@ember/object';
import { runTask, pollTask, cancelPoll } from 'ember-lifeline';
import { tracked } from 'tracked-built-ins';

export default class ForceUpdateService extends Service {
  POLL_INTERVAL_SECONDS = VersionTrackerService.VERSION_CHECK_INTERVAL_SECONDS;

  @service declare router: RouterService;
  @service declare versionTracker: VersionTrackerService;

  @tracked isFirstPollComplete = false;

  @action
  async poll(next: () => void) {
    await this.versionTracker.fetchLatestVersionIfNeeded();

    if (this.versionTracker.currentVersionIsIncompatible && this.router.currentRouteName !== 'update-required') {
      this.router.transitionTo('update-required', { queryParams: { next: `${this.router.currentURL}` } });

      return;
    }

    // This workaround is required to skip the very first poll, so that tests don't lag
    // https://github.com/ember-lifeline/ember-lifeline/issues/72
    if (this.isFirstPollComplete) {
      runTask(this, next, config.environment == 'test' ? 0 : this.POLL_INTERVAL_SECONDS * 1000);
    } else {
      this.isFirstPollComplete = true;
      next();
    }
  }

  setupListener() {
    pollTask(this, 'poll', 'FORCE_UPDATE_POLLER');
  }

  willDestroy() {
    cancelPoll(this, 'FORCE_UPDATE_POLLER');
  }
}
