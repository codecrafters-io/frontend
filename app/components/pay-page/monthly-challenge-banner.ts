import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import MonthlyChallengeBannerService from 'codecrafters-frontend/services/monthly-challenge-banner';

interface Signature {
  Element: HTMLAnchorElement;
}

export default class MonthlyChallengeBanner extends Component<Signature> {
  @service declare monthlyChallengeBanner: MonthlyChallengeBannerService;
}
