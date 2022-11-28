import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class ReferralLinkStatsContainerComponent extends Component {
  @service('current-user') currentUserService;

  get currentUser() {
    return this.currentUserService.record;
  }

  get trialCount() {
    return this.args.referralLink.activations.filterBy('hasStartedTrial').length;
  }
}
