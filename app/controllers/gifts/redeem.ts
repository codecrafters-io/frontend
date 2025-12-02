import Controller from '@ember/controller';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type RouterService from '@ember/routing/router-service';
import type { ModelType } from 'codecrafters-frontend/routes/gifts/redeem';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class GiftsRedeemController extends Controller {
  declare model: ModelType;

  @service declare router: RouterService;
  @service declare authenticator: AuthenticatorService;

  @tracked isRedeemingGift = false;

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
  async handleRedeemButtonClick() {
    if (this.currentUserIsAnonymous) {
      this.authenticator.initiateLogin();

      return;
    }

    if (this.redeemButtonIsDisabled) {
      return;
    }

    this.isRedeemingGift = true;

    try {
      await this.model.redeem({});
      this.router.transitionTo('catalog');
    } catch (error) {
      // TODO: Handle error appropriately
      this.isRedeemingGift = false;
      throw error;
    }
  }
}
