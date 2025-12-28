// Invokes a callback when an ActionCable message is received.
// Usage: <div {{on-action-cable-message this.handleCallback channel="ChannelName" args=(hash id=123)}}></div>
import Modifier from 'ember-modifier';
import { service } from '@ember/service';
import { registerDestructor } from '@ember/destroyable';
import type ActionCableConsumerService from 'codecrafters-frontend/services/action-cable-consumer';
import type { ActionCableSubscription } from 'codecrafters-frontend/services/action-cable-consumer';
import * as Sentry from '@sentry/ember';

interface Signature {
  Args: {
    Positional: [() => void];
    Named: {
      channel: string;
      args: Record<string, string>;
    };
  };
}

export default class OnActionCableMessageModifier extends Modifier<Signature> {
  actionCableSubscription?: ActionCableSubscription;
  callback?: () => void;

  @service declare actionCableConsumer: ActionCableConsumerService;

  modify(_element: HTMLElement, [callback]: [() => void], named: Signature['Args']['Named']) {
    this.callback = callback;

    const { channel, args } = named;

    this.actionCableSubscription = this.actionCableConsumer.subscribe(channel, args, {
      onData: () => {
        this.callback?.();
        console.log(`${channel} data`);
      },
      onInitialize: () => {
        this.callback?.();
        console.log(`${channel} initialized`);
      },
      onDisconnect: () => {
        console.log(`${channel} disconnected`);
      },
      onReject: () => {
        console.error(`Failed to connect to ${channel}`);
        Sentry.captureMessage(`Failed to connect to ${channel}`);
      },
    });

    registerDestructor(this, () => {
      console.log(`unsubscribing from ${channel}`);
      this.actionCableSubscription?.unsubscribe();
    });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'on-action-cable-message': typeof OnActionCableMessageModifier;
  }
}
