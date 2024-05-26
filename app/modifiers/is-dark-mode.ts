import { registerDestructor } from '@ember/destroyable';
import { service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import Modifier from 'ember-modifier';
import type DarkModeService from 'codecrafters-frontend/services/dark-mode';

/**
 * Enable or disable the DOM Mutation Observer
 */
const DOM_MUTATION_OBSERVER_ENABLED: boolean = false; // TODO: Figure out an efficient way to enable the observer while avoiding too many calls

/**
 * Enable or disable subscribing to `DarkModeService.isEnabled` changes
 */
const DARK_MODE_UPDATE_LISTENER_ENABLED: boolean = true;

/**
 * Method to use for delaying `triggerCallback` task execution:
 * - `restartable` cancels all queued calls before they have a chance to execute, executes only the latest call: causes much less unnecessary task executions
 * - `keepLatest` always executes first & last queued calls, cancelling the ones in-between: might be more reliable but always triggers rendering twice
 */
const CALLBACK_TASK_TIMEOUT_METHOD: 'keepLatest' | 'restartable' = 'restartable';

/**
 * Timeout used for `restartable` method
 */
const CALLBACK_TASK_TIMEOUT_PRE: number = 10;

/**
 * Timeout used for `keepLatest` method when `DOM_MUTATION_OBSERVER_ENABLED` is true
 */
const CALLBACK_TASK_TIMEOUT_POST: number = 100;

/**
 * Name of element's attribute for storing the currently reported state of Dark Mode,
 * to avoid invoking callbacks again with same value and to prevent double-renders
 */
const CACHED_STATE_ATTRIBUTE_NAME = 'data-reported-dark-mode';

/**
 * Modifier Args Signature
 */
type Signature = {
  Args: {
    Positional: [callback: (isDarkMode: boolean) => void];
  };
};

/**
 * Invokes a callback on initial load and when Dark Mode environment changes,
 * passing it `isDarkMode: boolean` as argument.
 * Calculated based on element's DOM parents with `.dark` class.
 * Relies on DarkModeService and/or DOM Mutation Obsersers for monitoring changes.
 * Usage:
 * ```
 * <div {{is-dark-mode this.handleDarkModeUpdated}} />
 * ```
 */
export default class IsDarkModeModifier extends Modifier<Signature> {
  @service declare darkMode: DarkModeService;

  /**
   * Callback to invoke on initial load and when Dark Mode environment changes
   * @private
   */
  #callback?: (isDarkMode: boolean) => void;

  /**
   * Elemnent which the modifier was used on
   * @private
   */
  #element?: HTMLElement;

  /**
   * Task for actually scanning the DOM and invoking the callback
   */
  triggerCallback = task({ [CALLBACK_TASK_TIMEOUT_METHOD]: true }, async () => {
    // For "restartable" to have immediate effect for sequential calls
    if (CALLBACK_TASK_TIMEOUT_METHOD === 'restartable') {
      await timeout(CALLBACK_TASK_TIMEOUT_PRE);
    }

    // Skip immediately if no callback is passed, to avoid an unnecessary DOM scan
    if (!this.#callback) {
      return;
    }

    // Scan the DOM for element parents with `.dark` class
    const isDarkMode = !!this.#element?.closest('.dark');

    // If callback was called earlier with same value - don't call it again to avoid double-renders
    if (this.#element?.getAttribute(CACHED_STATE_ATTRIBUTE_NAME) === `${isDarkMode}`) {
      return;
    }

    // Remember which value is passed to the callback
    this.#element?.setAttribute(CACHED_STATE_ATTRIBUTE_NAME, `${isDarkMode}`);
    this.#callback(isDarkMode);

    // Ensure we don't run this task too often when DOM Observer is enabled
    if (CALLBACK_TASK_TIMEOUT_METHOD === 'keepLatest' && DOM_MUTATION_OBSERVER_ENABLED) {
      await timeout(CALLBACK_TASK_TIMEOUT_POST);
    }
  });

  /**
   * Modifier constructor, called when modifier is rendered.
   * @param element element to which the modifier is attached
   * @param callback callback to invoke on initial load and when Dark Mode environment changes
   */
  modify(element: HTMLElement, [callback]: [(isDarkMode: boolean) => void]) {
    this.#element = element;
    this.#callback = callback;

    if (DOM_MUTATION_OBSERVER_ENABLED) {
      const domMutationObserver = new MutationObserver((_mutationsList: MutationRecord[], _observer: MutationObserver) => {
        this.triggerCallback.perform();
      });
      domMutationObserver.observe(document.body, { attributes: true, childList: true, subtree: true, attributeFilter: ['class'] });
      registerDestructor(this, () => {
        domMutationObserver.disconnect();
      });
    }

    if (DARK_MODE_UPDATE_LISTENER_ENABLED) {
      const darkModeUpdateListener = () => {
        this.triggerCallback.perform();
      };

      this.darkMode.registerUpdateListener(darkModeUpdateListener);
      registerDestructor(this, () => {
        this.darkMode.unregisterUpdateListener(darkModeUpdateListener);
      });
    }

    this.triggerCallback.perform(); // Perform once on initial load
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'is-dark-mode': typeof IsDarkModeModifier;
  }
}
