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

function cleanup(instance: OnActionCableMessageModifier) {
  if (instance.actionCableSubscription) {
    console.log(`unsubscribing from ${instance.subscribedChannel}`);
    instance.actionCableSubscription.unsubscribe();
  }
}

export default class OnActionCableMessageModifier extends Modifier<Signature> {
  actionCableSubscription?: ActionCableSubscription;
  callback?: () => void;
  subscribedArgs?: Record<string, string>;
  subscribedChannel?: string;

  @service declare actionCableConsumer: ActionCableConsumerService;

  modify(_element: HTMLElement, [callback]: [() => void], named: Signature['Args']['Named']) {
    this.callback = callback;

    const { channel, args } = named;

    if (channel === this.subscribedChannel && JSON.stringify(args) === JSON.stringify(this.subscribedArgs)) {
      return;
    }

    cleanup(this);

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

    this.subscribedChannel = channel;
    this.subscribedArgs = args;

    registerDestructor(this, cleanup);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'on-action-cable-message': typeof OnActionCableMessageModifier;
  }
}
