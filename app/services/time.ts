import DateService from 'codecrafters-frontend/services/date';
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class TimeService extends Service {
  @tracked declare currentTime: Date;
  @tracked declare intervalId: number;

  @service declare date: DateService;

  setupTimer() {
    this.currentTime = new Date(this.date.now());

    this.intervalId = setInterval(() => {
      this.currentTime = new Date(this.date.now());
    }, 1000);
  }

  willDestroy() {
    clearInterval(this.intervalId);
  }
}
