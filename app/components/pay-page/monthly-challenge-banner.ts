import Component from '@glimmer/component';

import petoiRobotDogImage from '/assets/images/monthly-challenges/petoirobotdog.png';

interface Signature {
  Element: HTMLAnchorElement;
}

export default class MonthlyChallengeBannerComponent extends Component<Signature> {
  petoiRobotDogImage = petoiRobotDogImage;

  get shouldShowBanner(): boolean {
    return new Date('November 30, 2023') > new Date();
  }
}
