import config from 'ember-get-config';
import Service from '@ember/service';
import ZSAMoonlanderLargeImage from '/assets/images/monthly-challenges/zsa-moonlander-large.png';
import ZSAMoonlanderSmallImage from '/assets/images/monthly-challenges/zsa-moonlander-small.png';

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

  get largeImageWidth() {
    return 'max-w-xl';
  }

  get monthShorthand() {
    return 'Dec';
  }

  get monthShorthandUppercase() {
    return this.monthShorthand.toUpperCase();
  }

  get payPageCopy() {
    return 'Win a ZSA Moonlander →';
  }

  get sidebarCopy() {
    return 'Win a ZSA Moonlander.';
  }

  get smallImage() {
    return ZSAMoonlanderSmallImage;
  }

  get url() {
    return 'https://codecrafters.io/december';
  }

  get year() {
    return '2023';
  }

  get yearShorthand() {
    return this.year.slice(-2);
  }
}
