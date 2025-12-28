// Invokes a callback when the document visibility changes (tab becomes hidden/visible).
// Usage: <div {{on-visibility-change this.handleVisibilityChange}}></div>
import Modifier from 'ember-modifier';
import { service } from '@ember/service';
import { registerDestructor } from '@ember/destroyable';
import type VisibilityService from 'codecrafters-frontend/services/visibility';

interface Signature {
  Args: {
    Positional: [(isVisible: boolean) => void];
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

  modify(_element: Element, [callback]: [(isVisible: boolean) => void]) {
    cleanup(this); // Ensure we remove the previous callback if present
    this.callbackId = this.visibility.registerCallback(callback);
    registerDestructor(this, cleanup);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'on-visibility-change': typeof OnVisibilityChangeModifier;
  }
}
