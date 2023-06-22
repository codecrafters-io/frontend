import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class ReferralLinkStatsContainerComponent extends Component {
  @service authenticator;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get trialCount() {
    return this.args.referralLink.activations.filterBy('hasStartedTrial').length;
  }
}
