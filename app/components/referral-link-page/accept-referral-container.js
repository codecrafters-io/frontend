import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import window from 'ember-window-mock';
import logoImage from '/assets/images/logo/logomark-color.svg';

export default class AcceptReferralContainerComponent extends Component {
  logoImage = logoImage;

  @service('current-user') currentUserService;
  @service store;
  @service router;

  @tracked isCreatingReferralActivation;

  get acceptOfferButtonIsEnabled() {
    return !this.isCreatingReferralActivation && !this.currentUserIsReferrer && !this.currentUserIsAlreadyEligibleForReferralDiscount;
  }

  get currentUser() {
    return this.currentUserService.record;
  }

  get currentUserIsAnonymous() {
    return this.currentUserService.isAnonymous;
  }

  @action
  async handleAcceptOfferButtonClick() {
    if (this.currentUserIsAnonymous) {
      window.location.href = '/login?next=' + encodeURIComponent(this.router.currentURL);
    } else if (this.acceptOfferButtonIsEnabled) {
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
  get currentUserIsReferrer() {
    if (this.currentUserService.isAnonymous) {
      return false;
    } else {
      return this.args.referralLink.user === this.currentUserService.record;
    }
  }

  get currentUserIsAlreadyEligibleForReferralDiscount() {
    if (this.currentUserService.isAnonymous) {
      return false;
    } else {
      return this.currentUserService.record.isEligibleForReferralDiscount;
    }
  }
}
