import type Store from '@ember-data/store';
import { run } from '@ember/runloop';
import config from 'codecrafters-frontend/config/environment';
import type VisibilityService from 'codecrafters-frontend/services/visibility';

declare global {
  interface Window {
    pollerInstances: Poller[];
  }
}

if (config.environment === 'test') {
  window.pollerInstances = [];
}

export default class Poller {
  intervalMilliseconds: number;
  isActive: boolean;
  model: unknown;
  onPoll?: (pollResult: unknown) => void;
  scheduledPollTimeoutId?: number;
  store: Store;
  visibilityService: VisibilityService;
  visibilityServiceCallbackId?: string;

  constructor({
    store,
    visibilityService,
    intervalMilliseconds,
  }: {
    store: Store;
    visibilityService: VisibilityService;
    intervalMilliseconds: number;
  }) {
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

  async doPoll(): Promise<unknown> {
    throw new Error('doPoll must be implemented by subclasses');
  }

  async forcePoll() {
    clearTimeout(this.scheduledPollTimeoutId);
    await this.pollFn();
  }

  async onVisibilityChange(isVisible: boolean) {
    if (isVisible) {
      this.forcePoll();
    }
  }

  async pollFn() {
    if (config.environment === 'test' && this.store.isDestroyed) {
      window.pollerInstances = window.pollerInstances.filter((poller) => poller !== this);

      return;
    }

    if (this.isActive && !this.isPaused) {
      await run(async () => {
        const pollResult = await this.doPoll();
        this.onPoll!(pollResult);
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

  start(model: unknown, onPoll: (pollResult: unknown) => void) {
    this.model = model;
    this.isActive = true;
    this.onPoll = onPoll || ((_) => {});
    this.scheduleDelayedPoll();
    this.visibilityServiceCallbackId = this.visibilityService.registerCallback(this.onVisibilityChange.bind(this));
  }

  stop() {
    this.isActive = false;
    clearTimeout(this.scheduledPollTimeoutId);

    if (this.visibilityServiceCallbackId) {
      this.visibilityService.deregisterCallback(this.visibilityServiceCallbackId);
    }
  }
}
