import Component from '@glimmer/component';

import ouraRingHorizonBannerImage from '/assets/images/monthly-challenges/oura-ring-horizon-banner.png';

interface Signature {
  Element: HTMLAnchorElement;
}

export default class MonthlyChallengeBannerComponent extends Component<Signature> {
  ouraRingHorizonBannerImage = ouraRingHorizonBannerImage;
}
