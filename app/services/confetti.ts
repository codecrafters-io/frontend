import Service from '@ember/service';
import confetti from 'canvas-confetti';
import FastBootService from 'ember-cli-fastboot/services/fastboot';
import { inject as service } from '@ember/service';
import type FocusService from './focus';

export default class ConfettiService extends Service {
  @service declare focus: FocusService;
  @service declare fastboot: FastBootService;

  async fire(options: confetti.Options = {}) {
    // canvas-confetti makes use of the document, doesn't make sense to run it in fastboot
    if (this.fastboot.isFastBoot) {
      return;
    }

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
