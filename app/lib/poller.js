import { run } from '@ember/runloop';
import config from 'codecrafters-frontend/config/environment';

if (config.environment === 'test') {
  window.pollerInstances = [];
}

export default class Poller {
  isActive;
  model;
  scheduledPollTimeoutId;
  store;

  constructor({ store, visibilityService, intervalMilliseconds }) {
    this.store = store;
    this.visibilityService = visibilityService;
    this.intervalMilliseconds = intervalMilliseconds;

    this.isActive = false;
    this.model = null;

    if (config.environment === 'test') {
      window.pollerInstances.push(this);
    }
  }

  get isPaused() {
    return this.visibilityService.isHidden;
  }

  async doPoll() {
    console.log('doPoll not implemented');
  }

  async pollFn() {
    if (config.environment === 'test' && this.store.isDestroyed) {
      window.pollerInstances.delete(this);
    }

    if (this.isActive && !this.isPaused) {
      run(async () => {
        let pollResult = await this.doPoll();
        this.onPoll(pollResult);
      });
    }

    if (this.isActive) {
      this.scheduleDelayedPoll();
    }
  }

  scheduleDelayedPoll() {
    this.scheduledPollTimeoutId = setTimeout(() => {
      this.pollFn();
    }, this.intervalMilliseconds);
  }

  start(model, onPoll) {
    this.model = model;
    this.isActive = true;
    this.onPoll = onPoll || (() => {});
    this.scheduleDelayedPoll();
  }

  stop() {
    this.isActive = false;
    clearTimeout(this.scheduledPollTimeoutId);
  }

  forcePoll() {
    clearTimeout(this.scheduledPollTimeoutId);
    this.pollFn();
  }
}
