import Component from '@glimmer/component';

import airpodsImage from '/assets/images/monthly-challenges/airpods.png';

interface Signature {
  Element: HTMLAnchorElement;
}

export default class MonthlyChallengeBannerComponent extends Component<Signature> {
  airpodsImage = airpodsImage;
}
