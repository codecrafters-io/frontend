// Asks the browser to confirm before the tab is closed or reloaded, while the argument is true.
// Usage: <div {{warn-before-unload this.shouldWarn}}></div>
import Modifier from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';

interface Signature {
  Args: {
    Positional: [boolean];
  };
}

function cleanup(instance: WarnBeforeUnloadModifier) {
  window.removeEventListener('beforeunload', instance.handleBeforeUnload);
}

export default class WarnBeforeUnloadModifier extends Modifier<Signature> {
  shouldWarn = false;

  handleBeforeUnload = (event: BeforeUnloadEvent): void => {
    if (this.shouldWarn) {
      event.preventDefault();
    }
  };

  modify(_element: Element, [shouldWarn]: [boolean]) {
    this.shouldWarn = shouldWarn;
    window.addEventListener('beforeunload', this.handleBeforeUnload);
    registerDestructor(this, cleanup);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'warn-before-unload': typeof WarnBeforeUnloadModifier;
  }
}
