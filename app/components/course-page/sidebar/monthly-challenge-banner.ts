import Component from '@glimmer/component';

// @ts-ignore
import airpodsImage from '/assets/images/monthly-challenges/airpods.png';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {};
}

export default class MonthlyChallengeBannerComponent extends Component<Signature> {
  airpodsImage = airpodsImage;
}
