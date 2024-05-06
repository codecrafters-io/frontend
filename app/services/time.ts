import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class TimeService extends Service {
  @tracked currentTime = new Date();

  constructor() {
    super();
    this.updateTime();
  }

  updateTime() {
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }
}
