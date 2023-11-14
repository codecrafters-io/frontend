import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import logoImage from '/assets/images/logo/logomark-color.svg';
import ReferralLinkModel from 'codecrafters-frontend/models/referral-link';
import RouterService from '@ember/routing/router-service';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import { add, format } from 'date-fns';
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

  @tracked isCreatingReferralActivation: boolean = false;
  @tracked isOfferAccepted: boolean = false;

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
    // @ts-ignore
    return this.currentUser && this.currentUser.freeUsageGrants.length > 0;
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

  get freeUsageGrantExpiresAt() {
    return format(add(new Date(), { days: 7 }), 'dd MMM yyyy');
  }

  @action
  async handleAcceptOfferButtonClick() {
    if (this.currentUserIsAnonymous) {
      this.authenticator.initiateLogin(null);
    } else if (this.acceptOfferButtonIsEnabled) {
      this.isCreatingReferralActivation = true;

      await this.store
        .createRecord('referral-activation', {
          referralLink: this.args.referralLink,
          customer: this.authenticator.currentUser,
          referrer: this.args.referralLink.user,
        })
        .save();

      this.isOfferAccepted = true;
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ReferralLinkPage::AcceptReferralContainer': typeof AcceptReferralContainerComponent;
  }
}
