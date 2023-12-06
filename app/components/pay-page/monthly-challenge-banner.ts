import Component from '@glimmer/component';
import MonthlyChallengeBannerService from 'codecrafters-frontend/services/monthly-challenge-banner';
import { inject as service } from '@ember/service';

interface Signature {
  Element: HTMLAnchorElement;
}

export default class MonthlyChallengeBannerComponent extends Component<Signature> {
  @service declare monthlyChallengeBanner: MonthlyChallengeBannerService;
}
