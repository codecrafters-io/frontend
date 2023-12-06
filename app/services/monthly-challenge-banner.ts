import config from 'ember-get-config';
import ZSAMoonlanderLargeImage from '/assets/images/monthly-challenges/zsa-moonlander-large.png';
import ZSAMoonlanderSmallImage from '/assets/images/monthly-challenges/zsa-moonlander-small.png';
import Service from '@ember/service';

export default class MonthlyChallengeBannerService extends Service {
  get imageAltText() {
    return 'ZSA Moonlander';
  }

  get isOutdated(): boolean {
    return new Date() >= new Date('January 01, 2024') && config.environment !== 'test';
  }

  get largeImage() {
    return ZSAMoonlanderLargeImage;
  }

  get smallImage() {
    return ZSAMoonlanderSmallImage;
  }

  get url() {
    return 'https://codecrafters.io/december';
  }
}
