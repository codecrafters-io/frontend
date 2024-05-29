import DateService from 'codecrafters-frontend/services/date';
import FastBootService from 'ember-cli-fastboot/services/fastboot';
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

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

    if (this.fastboot.isFastBoot) {
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
