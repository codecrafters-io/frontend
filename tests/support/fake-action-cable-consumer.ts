import type { ActionCableSubscription } from 'codecrafters-frontend/services/action-cable-consumer';

type SubscriptionCallbacks = {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onData?: (data: string) => void;
};

export default class FakeActionCableConsumer {
  #subscriptions: Record<string, SubscriptionCallbacks> = {};

  sendData(channel: string, data: string): void {
    if (!this.#subscriptions[channel]) {
      throw new Error(`No subscription for channel ${channel}`);
    }

    const onDataCallback = this.#subscriptions[channel]?.onData;

    if (onDataCallback) {
      onDataCallback(data);
    }
  }

  subscribe(channel: string, _args: Record<string, string> = {}, callbacks: SubscriptionCallbacks): ActionCableSubscription {
    this.#subscriptions[channel] = callbacks;

    return {
      send: () => {},
      unsubscribe: () => {},
    };
  }
}
