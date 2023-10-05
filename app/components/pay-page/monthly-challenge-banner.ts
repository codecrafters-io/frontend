import Component from '@glimmer/component';

import ouraRingHorizonImage from '/assets/images/monthly-challenges/oura-ring-horizon.png';

interface Signature {
  Element: HTMLAnchorElement;
}

export default class MonthlyChallengeBannerComponent extends Component<Signature> {
  ouraRingHorizonImage = ouraRingHorizonImage;
}
