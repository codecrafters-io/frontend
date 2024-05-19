import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class TimeService extends Service {
  @tracked currentTime = new Date();
  @tracked intervalId: number;

  constructor() {
    super();
    this.intervalId = this.updateTime();
  }

  updateTime() {
    return setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  willDestroy() {
    clearInterval(this.intervalId);
  }
}
