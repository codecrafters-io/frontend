import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import logoImage from '/assets/images/logo/logomark-color.svg';
import type AffiliateLinkModel from 'codecrafters-frontend/models/affiliate-link';
import type Store from '@ember-data/store';
import type RouterService from '@ember/routing/router-service';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

interface Signature {
  Element: HTMLElement;

  Args: {
    affiliateLink: AffiliateLinkModel;
  };
}

export default class AcceptReferralContainerComponent extends Component<Signature> {
  logoImage = logoImage;

  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;
  @service declare router: RouterService;

  @tracked isCreatingAffiliateReferral = false;

  get acceptOfferButtonIsEnabled() {
    return (
      !this.isCreatingAffiliateReferral &&
      !this.currentUserIsReferrer &&
      !this.currentUserIsAlreadyEligibleForReferralDiscount &&
      !this.currentUserCanAccessMembershipBenefits
    );
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get currentUserCanAccessMembershipBenefits() {
    return this.authenticator.currentUser && this.authenticator.currentUser.canAccessMembershipBenefits;
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
      this.authenticator.initiateLogin(null);
    } else if (this.acceptOfferButtonIsEnabled) {
      this.isCreatingAffiliateReferral = true;

      await this.store
        .createRecord('affiliate-referral', {
          affiliateLink: this.args.affiliateLink,
          customer: this.authenticator.currentUser,
          referrer: this.args.affiliateLink.user,
        })
        .save();

      await this.authenticator.currentUser!.fetchCurrent({}); // Refresh free usage grant columns
      this.router.transitionTo('pay');
    }
  }
}
