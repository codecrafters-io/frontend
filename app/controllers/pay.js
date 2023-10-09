import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class PayController extends Controller {
  @service analyticsEventTracker;
  @service authenticator;
  @service router;
  @tracked isCreatingCheckoutSession = false;
  @tracked shouldApplyRegionalDiscount = false;

  get discountedYearlyPrice() {
    if (this.user.isEligibleForCustomDiscount) {
      return this.user.availableCustomDiscount.discountedYearlyPriceInDollars;
    } else if (this.user.isEligibleForReferralDiscount) {
      return 216;
    } else if (this.user.isEligibleForEarlyBirdDiscount) {
      return 216;
    } else {
      return null;
    }
  }

  get user() {
    return this.authenticator.currentUser;
  }

  @action
  async handleTryNowPayLaterButtonClicked() {
    this.analyticsEventTracker.track('dismissed_payment_prompt');
    this.router.transitionTo('tracks');
  }
}
