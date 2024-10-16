// Invokes a callback when the model is updated.
// Usage: <div {{model-did-update this.handleModelDidUpdate model}}></div>
import Modifier from 'ember-modifier';
import type Transition from '@ember/routing/transition';
import { inject as service } from '@ember/service';
import { registerDestructor } from '@ember/destroyable';
import type Model from '@ember-data/model';
import type ActionCableConsumerService from 'codecrafters-frontend/services/action-cable-consumer';
import type { ActionCableSubscription } from 'codecrafters-frontend/services/action-cable-consumer';

interface Signature {
  Args: {
    Positional: [(transition: Transition) => void, Model];
  };
}

export default class ModelDidUpdateModifier extends Modifier<Signature> {
  actionCableSubscription?: ActionCableSubscription;
  callback?: () => void;
  model?: Model;

  @service declare actionCableConsumer: ActionCableConsumerService;

  modify(_element: HTMLElement, [callback, model]: [() => void, Model]) {
    this.callback = callback;
    this.model = model;

    this.actionCableSubscription = this.actionCableConsumer.subscribe(
      'CourseTesterVersionChannel',
      { course_tester_version_id: this.model.id },
      {
        onData: () => {
          this.callback?.();
          console.log('CourseTesterVersionChannel data');
        },
        onConnect: () => {
          this.callback?.();
          console.log('CourseTesterVersionChannel connected');
        },
        onDisconnect: () => {
          console.log('CourseTesterVersionChannel disconnected');
        },
      },
    );

    registerDestructor(this, () => {
      console.log('unsubscribing from CourseTesterVersionChannel');
      this.actionCableSubscription?.unsubscribe();
    });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'model-did-update': typeof ModelDidUpdateModifier;
  }
}
