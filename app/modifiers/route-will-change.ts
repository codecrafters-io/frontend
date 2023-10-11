// Invokes a callback when the route is about to change.
// Usage: <div {{route-will-change this.handleRouteWillChange}}></div>
import Modifier from 'ember-modifier';
import RouterService from '@ember/routing/router-service';
import Transition from '@ember/routing/transition';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { registerDestructor } from '@ember/destroyable';

type Signature = {
  Args: {
    Positional: [(transition: Transition) => void];
  };
};

function cleanup(instance: RouteWillChangeModifier) {
  instance.router.off('routeWillChange', instance.eventHandler);
}

export default class RouteWillChangeModifier extends Modifier<Signature> {
  callback?: (transition: Transition) => void;

  @service router!: RouterService;

  @action
  eventHandler(transition: Transition) {
    // Ember's docs don't mention this property?
    // @ts-ignore
    if (transition.isAborted) {
      return;
    }

    if (this.callback) {
      this.callback(transition);
    }
  }

  modify(_element: HTMLElement, [callback]: [(transition: Transition) => void]) {
    this.callback = callback;
    this.router.on('routeWillChange', this.eventHandler);
    registerDestructor(this, cleanup);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'route-will-change': typeof RouteWillChangeModifier;
  }
}
