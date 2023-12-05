import Component from '@glimmer/component';

import petoiRobotDogImage from '/assets/images/monthly-challenges/petoirobotdog.png';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    shouldShowMonthlyChallengeBanner: boolean;
  };
}

export default class MonthlyChallengeBannerComponent extends Component<Signature> {
  petoiRobotDogImage = petoiRobotDogImage;
}
