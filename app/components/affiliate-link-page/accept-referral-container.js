import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import logoImage from '/assets/images/logo/logomark-color.svg';

export default class AcceptReferralContainerComponent extends Component {
  logoImage = logoImage;

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

  get currentUserIsAlreadyEligibleForReferralDiscount() {
    return this.authenticator.currentUser && this.authenticator.currentUser.isEligibleForReferralDiscount;
  }

  get currentUserIsAnonymous() {
    return this.authenticator.isAnonymous;
  }

  get currentUserIsReferrer() {
    if (this.authenticator.isAnonymous) {
      return false;
    } else {
      return this.args.affiliateLink.user === this.authenticator.currentUser;
    }
  }

  @action
  async handleAcceptOfferButtonClick() {
    if (this.currentUserIsAnonymous) {
      this.authenticator.initiateLogin();
    } else if (this.acceptOfferButtonIsEnabled) {
      this.isCreatingReferralActivation = true;

      await this.store
        .createRecord('referral-activation', {
          affiliateLink: this.args.affiliateLink,
          customer: this.authenticator.currentUser,
          referrer: this.args.affiliateLink.user,
        })
        .save();

      this.router.transitionTo('pay');
    }
  }
}
