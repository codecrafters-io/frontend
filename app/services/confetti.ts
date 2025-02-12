import Service, { inject as service } from '@ember/service';
import confetti from 'canvas-confetti';
import FastBootService from 'ember-cli-fastboot/services/fastboot';
import type FocusService from './focus';
import { registerDestructor } from '@ember/destroyable';

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

  #calculateConfettiOriginBasedOnMousePositionOrElementCenter(element: HTMLElement) {
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Get the element's bounding rectangle
    const rect = element.getBoundingClientRect();

    // if mouseEvent is inside the rect, return the mouseEvent's position
    const mouseEvent = window.event as MouseEvent;
    if (mouseEvent) {
      const x = mouseEvent.clientX;
      const y = mouseEvent.clientY;
      if (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
        return {
          x: x / viewportWidth,
          y: y / viewportHeight,
        };
      }
    }

    // otherwise, return the rect's center position
    return this.#calculateConfettiOrigin(element);
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

  async fireFromMousePositionOrElement(element: HTMLElement, options: confetti.Options = {}) {
    // canvas-confetti makes use of the document, doesn't make sense to run it in fastboot
    if (this.fastboot.isFastBoot) {
      return;
    }

    options.origin = this.#calculateConfettiOriginBasedOnMousePositionOrElementCenter(element);

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

      registerDestructor(this, () => {
        this.focus.deregisterCallback(callbackId);
      });
    }
  }
}
