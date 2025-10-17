// Invokes a callback when a logstream is updated.
// Usage: <div {{logstream-did-update this.handleLogstreamDidUpdate logstreamId}}></div>
import type ActionCableConsumerService from 'codecrafters-frontend/services/action-cable-consumer';
import type Store from '@ember-data/store';
import Logstream from 'codecrafters-frontend/utils/logstream';
import Modifier from 'ember-modifier';
import { inject as service } from '@ember/service';
import { registerDestructor } from '@ember/destroyable';
import { action } from '@ember/object';

interface Signature {
  Args: {
    Positional: [(logstream: Logstream) => void, string];
  };
}

export default class LogstreamDidUpdateModifier extends Modifier<Signature> {
  @service declare actionCableConsumer: ActionCableConsumerService;
  @service declare store: Store;

  callback?: (logstream: Logstream) => void;
  logstream?: Logstream;

  @action
  handleLogstreamDidPoll(): void {
    this.callback!(this.logstream!);
  }

  modify(_element: HTMLElement, [callback, logstreamId]: Signature['Args']['Positional']) {
    this.logstream = new Logstream(logstreamId, this.actionCableConsumer, this.store, this.handleLogstreamDidPoll);
    this.callback = callback;

    console.log(`subscribing to logstream#${logstreamId}`);
    this.logstream.subscribe();

    registerDestructor(this, () => {
      console.log(`unsubscribing from logstream#${logstreamId}`);
      this.logstream?.unsubscribe();
    });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'logstream-did-update': typeof LogstreamDidUpdateModifier;
  }
}
