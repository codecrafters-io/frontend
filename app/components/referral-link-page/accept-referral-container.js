import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import logoImage from '/assets/images/logo/logomark-color.svg';

export default class AcceptReferralContainerComponent extends Component {
  logoImage = logoImage;

  @service authentication;
  @service authenticator;
  @service store;
  @service router;

  @tracked isCreatingReferralActivation;

  get acceptOfferButtonIsEnabled() {
    return !this.isCreatingReferralActivation && !this.currentUserIsReferrer && !this.currentUserIsAlreadyEligibleForReferralDiscount;
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get currentUserIsAnonymous() {
    return this.authenticator.isAnonymous;
  }

  @action
  async handleAcceptOfferButtonClick() {
    if (this.currentUserIsAnonymous) {
      this.authentication.initiateLogin();
    } else if (this.acceptOfferButtonIsEnabled) {
      this.isCreatingReferralActivation = true;

      await this.store
        .createRecord('referral-activation', {
          referralLink: this.args.referralLink,
          customer: this.authenticator.currentUser,
          referrer: this.args.referralLink.user,
        })
        .save();

      this.router.transitionTo('pay');
    }
  }
  get currentUserIsReferrer() {
    if (this.authenticator.isAnonymous) {
      return false;
    } else {
      return this.args.referralLink.user === this.authenticator.currentUser;
    }
  }

  get currentUserIsAlreadyEligibleForReferralDiscount() {
    return this.authenticator.currentUser && this.authenticator.currentUser.isEligibleForReferralDiscount;
  }
}
