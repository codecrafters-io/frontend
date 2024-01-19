import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import FreeUsageGrantModel from 'codecrafters-frontend/models/free-usage-grant';
import logoImage from '/assets/images/logo/logomark-color.svg';
import ReferralLinkModel from 'codecrafters-frontend/models/referral-link';
import RouterService from '@ember/routing/router-service';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import { format } from 'date-fns';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLElement;

  Args: {
    acceptedReferralOfferFreeUsageGrant: FreeUsageGrantModel | null;
    referralLink: ReferralLinkModel;
  };
}

export default class AcceptReferralContainerComponent extends Component<Signature> {
  logoImage = logoImage;

  @service authenticator!: AuthenticatorService;
  @service store!: Store;
  @service router!: RouterService;

  @tracked isAccepted: boolean = this.args.acceptedReferralOfferFreeUsageGrant ? true : false;
  @tracked isCreatingReferralActivation: boolean = false;
  @tracked freeUsageGrantExpiresAt: string = this.args.acceptedReferralOfferFreeUsageGrant
    ? format(this.args.acceptedReferralOfferFreeUsageGrant.expiresAt, 'dd MMM yyyy')
    : '';

  get acceptOfferButtonIsEnabled() {
    return (
      !this.isCreatingReferralActivation &&
      !this.currentUserIsReferrer &&
      !this.currentUserAcceptedReferralOfferIsExpired &&
      !this.currentUser?.canAccessPaidContent
    );
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get currentUserAcceptedReferralOfferIsExpired() {
    return this.currentUser?.hasActiveFreeUsageGrantsValueIsOutdated;
  }

  get currentUserAlreadyAcceptedReferralOffer() {
    return !this.currentUserIsReferrer && this.isAccepted && !this.currentUserAcceptedReferralOfferIsExpired;
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
        .createRecord('referral-activation', {
          referralLink: this.args.referralLink,
          customer: this.authenticator.currentUser,
          referrer: this.args.referralLink.user,
        })
        .save();

      const freeUsageGrant = await this.store.query('free-usage-grant', {
        user_id: this.currentUser?.id,
      });

      this.freeUsageGrantExpiresAt = format(freeUsageGrant.objectAt(0)?.expiresAt, 'dd MMM yyyy');
      this.isAccepted = true;
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ReferralLinkPage::AcceptReferralContainer': typeof AcceptReferralContainerComponent;
  }
}
