// Invokes a callback when the document visibility changes (tab becomes hidden/visible).
// Usage: <div {{on-visibility-change this.handleVisibilityChange}}></div>
// Usage with filter: <div {{on-visibility-change this.handleVisibilityChange if="visible"}}></div>
import Modifier from 'ember-modifier';
import { service } from '@ember/service';
import { registerDestructor } from '@ember/destroyable';
import type VisibilityService from 'codecrafters-frontend/services/visibility';

interface Signature {
  Args: {
    Positional: [(isVisible: boolean) => void];
    Named: {
      if?: 'visible' | 'hidden';
    };
  };
}

function cleanup(instance: OnVisibilityChangeModifier) {
  if (instance.callbackId) {
    instance.visibility.deregisterCallback(instance.callbackId);
  }
}

export default class OnVisibilityChangeModifier extends Modifier<Signature> {
  callbackId?: string;

  @service declare visibility: VisibilityService;

  modify(_element: Element, [callback]: [(isVisible: boolean) => void], named: Signature['Args']['Named']) {
    cleanup(this); // Ensure we remove the previous callback if present

    const { if: condition } = named;

    // Create a wrapper callback that filters based on the condition
    const wrappedCallback = (isVisible: boolean) => {
      if (condition === 'visible' && !isVisible) {
        return;
      }

      if (condition === 'hidden' && isVisible) {
        return;
      }

      callback(isVisible);
    };

    this.callbackId = this.visibility.registerCallback(wrappedCallback);
    registerDestructor(this, cleanup);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'on-visibility-change': typeof OnVisibilityChangeModifier;
  }
}
