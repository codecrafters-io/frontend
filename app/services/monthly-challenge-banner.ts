import config from 'ember-get-config';
import Service from '@ember/service';
import LargeImage from '/assets/images/monthly-challenges/large.png';
import SmallImage from '/assets/images/monthly-challenges/small.png';

export default class MonthlyChallengeBannerService extends Service {
  get imageAltText() {
    return 'ZSA Moonlander';
  }

  get isOutdated(): boolean {
    return new Date() >= new Date('January 01, 2024') && config.environment !== 'test';
  }

  get largeImage() {
    return LargeImage;
  }

  get payPageBannerTitle() {
    return 'DEC 2023 CHALLENGE';
  }

  get payPageCta() {
    return 'Win a ZSA Moonlander.';
  }

  get sidebarBannerTitle() {
    return "Complete 1 challenge in Dec '23";
  }

  get sidebarCta() {
    return 'Win a ZSA Moonlander →';
  }

  get smallImage() {
    return SmallImage;
  }

  get url() {
    return 'https://codecrafters.io/december';
  }
}
