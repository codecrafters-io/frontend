import Service from '@ember/service';
import confetti from 'canvas-confetti';
import FastBootService from 'ember-cli-fastboot/services/fastboot';
import { inject as service } from '@ember/service';
import type FocusService from './focus';

export default class ConfettiService extends Service {
  @service declare focus: FocusService;
  @service declare fastboot: FastBootService;

  #calculateConfettiOrigin(element: HTMLElement) {
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Get the element's bounding rectangle
    const rect = element.getBoundingClientRect();

    // Calculate the element's center position relative to the viewport
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Convert these positions to a scale of 0 to 1, relative to the viewport
    const originX = centerX / viewportWidth;
    const originY = centerY / viewportHeight;

    return { x: originX, y: originY };
  }

  async fire(options: confetti.Options = {}) {
    // canvas-confetti makes use of the document, doesn't make sense to run it in fastboot
    if (this.fastboot.isFastBoot) {
      return;
    }

    return confetti(options);
  }

  async fireFromElement(element: HTMLElement, options: confetti.Options = {}) {
    // canvas-confetti makes use of the document, doesn't make sense to run it in fastboot
    if (this.fastboot.isFastBoot) {
      return;
    }

    options.origin = this.#calculateConfettiOrigin(element);

    return confetti(options);
  }

  async fireOnFocus(options: confetti.Options = {}) {
    if (this.focus.isFocused) {
      await this.fire(options);
    } else {
      const callbackId = this.focus.registerCallback((isFocused) => {
        if (isFocused) {
          this.fire(options);
          this.focus.deregisterCallback(callbackId);
        }
      });
    }
  }
}
