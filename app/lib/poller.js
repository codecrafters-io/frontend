import { run } from '@ember/runloop';

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
  }

  get isPaused() {
    return this.visibilityService.isHidden;
  }

  async doPoll() {
    console.log('doPoll not implemented');
  }

  scheduleDelayedPoll() {
    this.scheduledPollTimeoutId = setTimeout(async () => {
      if (this.isActive && !this.isPaused) {
        run(async () => {
          let pollResult = await this.doPoll();
          this.onPoll(pollResult);
        });
      }

      if (this.isActive) {
        this.scheduleDelayedPoll();
      }
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
}
