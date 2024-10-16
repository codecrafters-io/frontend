// Invokes a callback when a model is updated.
// Usage: <div {{model-did-update this.handleModelDidUpdate model}}></div>
import Modifier from 'ember-modifier';
import type Transition from '@ember/routing/transition';
import { inject as service } from '@ember/service';
import { registerDestructor } from '@ember/destroyable';
import type Model from '@ember-data/model';
import type ActionCableConsumerService from 'codecrafters-frontend/services/action-cable-consumer';
import type { ActionCableSubscription } from 'codecrafters-frontend/services/action-cable-consumer';
import { classify, underscore } from '@ember/string';
import * as Sentry from '@sentry/ember';

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

    const modelName = (this.model.constructor as typeof Model).modelName as string;

    this.actionCableSubscription = this.actionCableConsumer.subscribe(
      `${classify(modelName)}Channel`,
      { [`${underscore(modelName)}_id`]: this.model.id },
      {
        onData: () => {
          this.callback?.();
          console.log(`${classify(modelName)}Channel data`);
        },
        onInitialize: () => {
          this.callback?.();
          console.log(`${classify(modelName)}Channel initialized`);
        },
        onDisconnect: () => {
          console.log(`${classify(modelName)}Channel disconnected`);
        },
        onReject: () => {
          console.error(`Failed to connect to ${classify(modelName)}Channel`);
          Sentry.captureMessage(`Failed to connect to ${classify(modelName)}Channel`);
        },
      },
    );

    registerDestructor(this, () => {
      console.log(`unsubscribing from ${classify(modelName)}Channel`);
      this.actionCableSubscription?.unsubscribe();
    });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'model-did-update': typeof ModelDidUpdateModifier;
  }
}
