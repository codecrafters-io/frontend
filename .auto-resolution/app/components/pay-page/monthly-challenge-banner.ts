import Component from '@glimmer/component';
import MonthlyChallengeBannerService from 'codecrafters-frontend/services/monthly-challenge-banner';
import { service } from '@ember/service';

interface Signature {
  Element: HTMLAnchorElement;
}

export default class MonthlyChallengeBanner extends Component<Signature> {
  @service declare monthlyChallengeBanner: MonthlyChallengeBannerService;
}
