import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import logoImage from '/assets/images/logo/logomark-color.svg';
import ReferralLinkModel from 'codecrafters-frontend/models/referral-link';
import RouterService from '@ember/routing/router-service';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLElement;

  Args: {
    referralLink: ReferralLinkModel;
  };
}

export default class AcceptReferralContainerComponent extends Component<Signature> {
  logoImage = logoImage;

  @service authenticator!: AuthenticatorService;
  @service store!: Store;
  @service router!: RouterService;

  @tracked isAccepted: boolean = false;
  @tracked isCreatingReferralActivation: boolean = false;

  get acceptOfferButtonIsEnabled() {
    return (
      !this.isCreatingReferralActivation &&
      !this.currentUserIsReferrer &&
      !this.currentUserAlreadyAcceptedReferral &&
      !this.currentUser?.canAccessPaidContent
    );
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get currentUserAlreadyAcceptedReferral() {
    return !!this.currentUser?.lastFreeUsageGrantExpiresAt;
  }

  get currentUserIsAnonymous() {
    return this.authenticator.isAnonymous;
  }

  get currentUserIsReferrer() {
    if (this.authenticator.isAnonymous) {
      return false;
    } else {
      return this.args.referralLink.user === this.authenticator.currentUser;
    }
  }

  @action
  async handleAcceptOfferButtonClick() {
    if (this.currentUserIsAnonymous) {
      this.authenticator.initiateLogin(null);
    } else if (this.acceptOfferButtonIsEnabled) {
      this.isCreatingReferralActivation = true;

      await this.store
        .createRecord('affiliate-referral', {
          affiliateLink: this.args.referralLink,
          customer: this.authenticator.currentUser,
          referrer: this.args.referralLink.user,
        })
        .save();

      this.isAccepted = true;
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ReferralLinkPage::AcceptReferralContainer': typeof AcceptReferralContainerComponent;
  }
}
