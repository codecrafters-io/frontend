import Service from '@ember/service';
import confetti from 'canvas-confetti';
import FastBootService from 'ember-cli-fastboot/services/fastboot';
import { inject as service } from '@ember/service';

export default class ConfettiService extends Service {
  @service declare fastboot: FastBootService;
  running = false;

  async fire(options: confetti.Options = {}) {
    // canvas-confetti makes use of the document, doesn't make sense to run it in fastboot
    if (this.fastboot.isFastBoot) {
      return;
    }

    return confetti(options);
  }
}
