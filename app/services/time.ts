import DateService from 'codecrafters-frontend/services/date';
import LocalStorageService from 'codecrafters-frontend/services/local-storage';
import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class TimeService extends Service {
  @tracked currentTime: Date;
  @tracked intervalId: number;

  @service declare date: DateService;
  @service declare localStorage: LocalStorageService;

  constructor() {
    super();
    // using another service from a service breaks tests?
    console.log('will this be logged', this.localStorage);
    this.currentTime = new Date();
    this.intervalId = this.updateTime();
  }

  updateTime() {
    return setInterval(() => {
      this.currentTime = new Date(this.date.now());
    }, 1000);
  }

  willDestroy() {
    clearInterval(this.intervalId);
  }
}
