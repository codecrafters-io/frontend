import { action } from '@ember/object';
import { runTask, pollTask, cancelPoll } from 'ember-lifeline';
import Service, { service } from '@ember/service';
import VersionTrackerService from './version-tracker';
import type RouterService from '@ember/routing/router-service';

export default class ForceUpdateService extends Service {
  POLL_INTERVAL_SECONDS = VersionTrackerService.VERSION_CHECK_INTERVAL_SECONDS;

  @service declare router: RouterService;
  @service declare versionTracker: VersionTrackerService;

  @action
  async poll(next: () => void) {
    console.log('poll');
    await this.versionTracker.fetchLatestVersionIfNeeded();

    if (this.versionTracker.currentVersionIsIncompatible && this.router.currentRouteName !== 'update-required') {
      this.router.transitionTo('update-required', { queryParams: { next: `${this.router.currentURL}` } });
    } else {
      runTask(this, next, this.POLL_INTERVAL_SECONDS * 1000);
    }
  }

  setupListener() {
    pollTask(this, 'poll', 'FORCE_UPDATE_POLLER');
  }

  willDestroy() {
    cancelPoll(this, 'FORCE_UPDATE_POLLER');
  }
}
