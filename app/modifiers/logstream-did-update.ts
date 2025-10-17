// Invokes a callback when a logstream is updated.
// Usage: <div {{logstream-did-update this.handleLogstreamDidUpdate logstreamId}}></div>
import type ActionCableConsumerService from 'codecrafters-frontend/services/action-cable-consumer';
import type Store from '@ember-data/store';
import Logstream from 'codecrafters-frontend/utils/logstream';
import Modifier, { type ArgsFor } from 'ember-modifier';
import { inject as service } from '@ember/service';
import { registerDestructor } from '@ember/destroyable';
import { action } from '@ember/object';
import type { Owner } from '@ember/test-helpers/build-owner';

interface Signature {
  Args: {
    Positional: [(logstream: Logstream) => void, string];
  };
}

function cleanup(instance: LogstreamDidUpdateModifier) {
  if (instance.logstream) {
    instance.logstream.unsubscribe();
  }
}

export default class LogstreamDidUpdateModifier extends Modifier<Signature> {
  @service declare actionCableConsumer: ActionCableConsumerService;
  @service declare store: Store;

  logstream?: Logstream;

  constructor(owner: unknown, args: ArgsFor<Signature>) {
    super(owner as Owner, args);
    registerDestructor(this, cleanup);
  }

  modify(_element: HTMLElement, [callback, logstreamId]: Signature['Args']['Positional']) {
    cleanup(this);

    this.logstream = new Logstream(logstreamId, this.actionCableConsumer, this.store, () => callback(this.logstream!));
    this.logstream.subscribe();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'logstream-did-update': typeof LogstreamDidUpdateModifier;
  }
}
