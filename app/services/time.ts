import DateService from 'codecrafters-frontend/services/date';
import FastBootService from 'ember-cli-fastboot/services/fastboot';
import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import config from 'codecrafters-frontend/config/environment';

export default class TimeService extends Service {
  @tracked declare currentTime: Date;
  @tracked declare intervalId: number;

  @service declare date: DateService;
  @service declare fastboot: FastBootService;

  advanceTimeByMilliseconds(milliseconds: number) {
    this.currentTime = new Date(this.currentTime.getTime() + milliseconds);
  }

  setupTimer() {
    this.currentTime = new Date(this.date.now());

    if (this.fastboot.isFastBoot || config.environment === 'test') {
      return;
    }

    this.intervalId = setInterval(() => {
      this.currentTime = new Date(this.date.now());
    }, 1000);
  }

  willDestroy() {
    if (this.fastboot.isFastBoot) {
      return;
    }

    clearInterval(this.intervalId);
  }
}
