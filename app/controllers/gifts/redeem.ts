import * as Sentry from '@sentry/ember';
import BYOXBanner from '/assets/images/affiliate-program-features/byox-banner.svg';
import BYOXBannerMobile from '/assets/images/affiliate-program-features/byox-banner-mobile.svg';
import Controller from '@ember/controller';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type RouterService from '@ember/routing/router-service';
import type { ModelType } from 'codecrafters-frontend/routes/gifts/redeem';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { waitFor } from '@ember/test-waiters';

export default class GiftsRedeemController extends Controller {
  BYOXBanner = BYOXBanner;
  BYOXBannerMobile = BYOXBannerMobile;

  declare model: ModelType;

  @service declare router: RouterService;
  @service declare authenticator: AuthenticatorService;

  @tracked isRedeemingGift = false;
  @tracked redeemError: string | null = null;

  get currentUserCanAccessMembershipBenefits() {
    return this.authenticator.currentUser && this.authenticator.currentUser.canAccessMembershipBenefits;
  }

  get currentUserIsAnonymous() {
    return this.authenticator.isAnonymous;
  }

  get redeemButtonIsDisabled() {
    // Button is disabled if user already has membership benefits
    return this.currentUserCanAccessMembershipBenefits || this.isRedeemingGift;
  }

  @action
  @waitFor
  async handleRedeemButtonClick() {
    if (this.currentUserIsAnonymous) {
      this.authenticator.initiateLogin();

      return;
    }

    if (this.redeemButtonIsDisabled) {
      return;
    }

    this.redeemError = null;
    this.isRedeemingGift = true;

    try {
      await this.model.redeem({});
      await this.authenticator.syncCurrentUser(); // Ensure newly created membership is available immediately
      this.router.transitionTo('settings.billing');
    } catch (error) {
      Sentry.captureException(error);
      this.isRedeemingGift = false;
      this.redeemError = 'Failed to redeem gift. Please try again.';
    }
  }
}
