import Component from '@glimmer/component';

import opalC1Image from '/assets/images/monthly-challenges/opal-c1.png';

interface Signature {
  Element: HTMLAnchorElement;
}

export default class MonthlyChallengeBannerComponent extends Component<Signature> {
  opalC1Image = opalC1Image;
}
