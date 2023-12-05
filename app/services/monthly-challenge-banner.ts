import Service from '@ember/service';

export default class MonthlyChallengeBannerService extends Service {
  get isOutdated(): boolean {
    return new Date("December 01, 2023") >= new Date();
  }
}
