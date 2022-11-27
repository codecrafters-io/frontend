import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import window from 'ember-window-mock';

export default class AcceptReferralContainerComponent extends Component {
  @service('current-user') currentUserService;
  @service store;
  @service router;

  @tracked isCreatingReferralActivation;

  get currentUserIsAnonymous() {
    return this.currentUserService.isAnonymous;
  }

  @action
  async handleAcceptOfferButtonClick() {
    if (this.currentUserIsAnonymous) {
      window.location.href = '/login?next=' + encodeURIComponent(this.router.currentURL);
    } else {
      this.isCreatingReferralActivation = true;

      await this.store
        .createRecord('referral-activation', {
          referralLink: this.args.referralLink,
          customer: this.currentUserService.record,
          referrer: this.args.referralLink.user,
        })
        .save();

      this.router.transitionTo('pay');
    }
  }
}
