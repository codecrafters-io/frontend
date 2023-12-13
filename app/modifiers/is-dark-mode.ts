// Invokes a callback when the dark mode setting changes (and on initial load).
// Usage: <div {{is-dark-mode this.handleDarkModeUpdated}}></div>
import { registerDestructor } from '@ember/destroyable';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import Modifier from 'ember-modifier';

type Signature = {
  Args: {
    Positional: [callback: (isDarkMode: boolean) => void];
  };
};

function cleanup(instance: IsDarkModeModifier) {
  if (instance.observer) {
    instance.observer.disconnect();
    instance.observer = undefined;
  }
}

export default class IsDarkModeModifier extends Modifier<Signature> {
  callback?: (isDarkMode: boolean) => void;
  element?: HTMLElement;
  observer?: MutationObserver;

  @action
  eventHandler(_mutationsList: MutationRecord[], _observer: MutationObserver) {
    this.eventHandlerTask.perform();
  }

  eventHandlerTask = task({ keepLatest: true }, async () => {
    const isDarkMode = !!this.element!.closest('.dark');

    if (this.callback) {
      this.callback(isDarkMode);
    }

    // When we support updates, we should ensures we aren't performing this check too often
    // await timeout(1000);
  });

  modify(element: HTMLElement, [callback]: [(isDarkMode: boolean) => void]) {
    this.callback = callback;
    this.element = element;

    // Disabling this until we're able to figure out an efficient way to do it - maybe use a DarkModeService with a callback?
    // We don't have any cases yet where dark mode is toggled after the initial load, so this is fine for now.
    // this.observer = new MutationObserver(this.eventHandler);
    // this.observer.observe(document.body, { attributes: true, childList: true, subtree: true, attributeFilter: ['class'] });

    this.eventHandlerTask.perform(); // Perform once on initial load

    registerDestructor(this, cleanup);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'is-dark-mode': typeof IsDarkModeModifier;
  }
}
