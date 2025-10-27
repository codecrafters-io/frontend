import JSONAPIAdapter from '@ember-data/adapter/json-api';
import type ActionCableConsumerService from 'codecrafters-frontend/services/action-cable-consumer';
import type Store from '@ember-data/store';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import type { ActionCableSubscription } from 'codecrafters-frontend/services/action-cable-consumer';

export default class Logstream {
  @tracked isTerminated = false;
  @tracked isSubscribed = false;
  @tracked content = '';

  actionCableSubscription: ActionCableSubscription | null = null;
  actionCableConsumerService!: ActionCableConsumerService;
  store!: Store;
  logstreamId!: string;
  nextCursor: string | null = null;
  onPoll!: () => void;

  constructor(logstreamId: string, actionCableConsumerService: ActionCableConsumerService, store: Store, onPoll: () => void) {
    this.actionCableConsumerService = actionCableConsumerService;
    this.logstreamId = logstreamId;
    this.store = store;
    this.onPoll = onPoll;
  }

  subscribe(): void {
    this.subscribeTask.perform();
  }

  unsubscribe(): void {
    if (this.actionCableSubscription) {
      this.actionCableSubscription.unsubscribe();
    }
  }

  subscribeTask = task({ drop: true }, async (): Promise<void> => {
    this.isTerminated = false;
    this.isSubscribed = false;

    this.actionCableSubscription = this.actionCableConsumerService.subscribe(
      'LogstreamChannel',
      { logstream_id: this.logstreamId },
      {
        onConnect: () => {
          this.pollTask.perform();
        },
        onData: () => {
          this.pollTask.perform();
        },
        onDisconnect: () => {
          console.log('logstream disconnected');
        },
      },
    );

    this.isSubscribed = true;
  });

  pollTask = task({ keepLatest: true }, async (): Promise<void> => {
    // @ts-expect-error store.adapterFor not typed
    const adapter: JSONAPIAdapter = this.store.adapterFor('application');

    const response = await adapter.ajax(`${adapter.host}/api/v1/logstreams/${this.logstreamId}/poll`, 'GET', {
      data: {
        cursor: this.nextCursor,
      },
    });

    this.content += response.content;
    this.nextCursor = response.next_cursor;

    if (this.nextCursor === null) {
      this.isTerminated = true;
      this.actionCableSubscription!.unsubscribe();
      this.isSubscribed = false;
    }

    this.onPoll();
  });
}
