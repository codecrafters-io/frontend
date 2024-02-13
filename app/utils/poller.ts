import type Store from '@ember-data/store';
import { run } from '@ember/runloop';
import config from 'codecrafters-frontend/config/environment';
import type ActionCableConsumerService from 'codecrafters-frontend/services/action-cable-consumer';
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
  actionCableConsumerService: ActionCableConsumerService;
  actionCableSubscription?: { unsubscribe: () => void };
  isActive: boolean;
  model: unknown;
  onPoll?: (pollResult: unknown) => void;
  store: Store;
  visibilityService: VisibilityService;
  visibilityServiceCallbackId?: string;

  constructor({
    store,
    visibilityService,
    actionCableConsumerService,
  }: {
    store: Store;
    visibilityService: VisibilityService;
    actionCableConsumerService: ActionCableConsumerService;
  }) {
    this.actionCableConsumerService = actionCableConsumerService;
    this.store = store;
    this.visibilityService = visibilityService;

    this.isActive = false;
    this.model = null;

    if (config.environment === 'test') {
      window.pollerInstances.push(this);
    }
  }

  async doPoll(): Promise<unknown> {
    throw new Error('doPoll must be implemented by subclasses');
  }

  async forcePoll() {
    if (this.isActive) {
      await run(async () => {
        const pollResult = await this.doPoll();
        this.onPoll!(pollResult);
      });
    }
  }

  async onVisibilityChange(isVisible: boolean) {
    if (isVisible) {
      this.forcePoll();
    }
  }

  start(model: unknown, onPoll: (pollResult: unknown) => void, actionCableChannelName?: string, actionCableChannelArgs?: Record<string, string>) {
    this.model = model;
    this.isActive = true;
    this.onPoll = onPoll || ((_) => {});
    this.visibilityServiceCallbackId = this.visibilityService.registerCallback(this.onVisibilityChange.bind(this));

    if (actionCableChannelName) {
      this.actionCableSubscription = this.actionCableConsumerService.subscribe(actionCableChannelName, actionCableChannelArgs, {
        onConnect: () => {
          console.log('ActionCable connected');
          this.forcePoll();
        },
        onData: () => {
          console.log('ActionCable received data, polling will be forced');
          this.forcePoll();
        },
        onDisconnect: () => {
          console.log('ActionCable disconnected, polling will be paused');
          this.forcePoll();
        },
      });
    }
  }

  stop() {
    this.isActive = false;

    if (this.visibilityServiceCallbackId) {
      this.visibilityService.deregisterCallback(this.visibilityServiceCallbackId);
    }

    if (this.actionCableSubscription) {
      this.actionCableSubscription.unsubscribe();
    }

    window.pollerInstances = window.pollerInstances.filter((poller) => poller !== this);
  }
}
