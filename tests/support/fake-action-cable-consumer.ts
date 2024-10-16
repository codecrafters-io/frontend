import type { ActionCableSubscription } from 'codecrafters-frontend/services/action-cable-consumer';

type SubscriptionCallbacks = {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onData?: (data: string) => void;
  onReject?: (error: Error) => void;
  onInitialize?: () => void;
};

export default class FakeActionCableConsumer {
  #subscriptions: Record<string, { id: string; args: Record<string, string>; callbacks: SubscriptionCallbacks }[]> = {};

  hasSubscription(channel: string, args?: Record<string, string>): boolean {
    if (args) {
      return !!this.#subscriptions[channel]?.some((subscription) => JSON.stringify(subscription.args) === JSON.stringify(args));
    }

    return !!this.#subscriptions[channel];
  }

  sendData(channel: string, data: string): void {
    if (!this.#subscriptions[channel]) {
      throw new Error(`No subscription for channel ${channel}`);
    }

    for (const subscription of this.#subscriptions[channel] || []) {
      subscription.callbacks.onData?.(data);
    }
  }

  subscribe(channel: string, args: Record<string, string> = {}, callbacks: SubscriptionCallbacks): ActionCableSubscription {
    const id = crypto.randomUUID();

    this.#subscriptions[channel] ||= [];
    this.#subscriptions[channel] = [...this.#subscriptions[channel], { id, args, callbacks }];

    return {
      send: () => {},
      unsubscribe: () => {
        this.#subscriptions[channel] = this.#subscriptions[channel]!.filter((subscription) => subscription.id !== id);
      },
    };
  }
}
