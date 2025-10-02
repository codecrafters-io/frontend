import Controller from '@ember/controller';
import type { ModelType } from 'codecrafters-frontend/routes/gifts/redeem';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import type RouterService from '@ember/routing/router-service';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

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
    return this.currentUserCanAccessMembershipBenefits;
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
      // TODO: Implement actual gift redeeming logic
      // This would typically involve calling an API endpoint to redeem the gift
      // For now, we'll just redirect to the catalog page as a placeholder
      this.router.transitionTo('catalog');
    } catch {
      // TODO: Handle error appropriately
      this.isRedeemingGift = false;
    }
  }
}
