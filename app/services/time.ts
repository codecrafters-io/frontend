import DateService from 'codecrafters-frontend/services/date';
import LocalStorageService from 'codecrafters-frontend/services/local-storage';
import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class TimeService extends Service {
  @tracked declare currentTime: Date;
  @tracked declare intervalId: number;

  @service declare date: DateService;
  @service declare localStorage: LocalStorageService;

  setupTimer() {
    this.currentTime = new Date();

    this.intervalId = setInterval(() => {
      this.currentTime = new Date(this.date.now());
    }, 1000);
  }

  willDestroy() {
    clearInterval(this.intervalId);
  }
}
