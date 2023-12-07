import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class PayController extends Controller {
  @service analyticsEventTracker;
  @service authenticator;
  @service monthlyChallengeBanner;
  @service router;
  @tracked configureCheckoutSessionModalIsOpen = false;
  @tracked isCreatingCheckoutSession = false;
  @tracked pricingFrequencyClicked = "";
  @tracked shouldApplyRegionalDiscount = false;

  get discountedYearlyPrice() {
    if (this.user.isEligibleForReferralDiscount) {
      return 216;
    } else if (this.user.isEligibleForEarlyBirdDiscount) {
      return 216;
    } else {
      return null;
    }
  }

  get additionalCheckoutSessionProperties() {
    const additionalCheckoutSessionProperties = {
      pricingFrequency: this.pricingFrequencyClicked,
      regionalDiscount: this.shouldApplyRegionalDiscount ? this.model.regionalDiscount : null,
    }

    if (this.pricingFrequencyClicked === 'yearly') {
      additionalCheckoutSessionProperties.earlyBirdDiscountEnabled = this.model.earlyBirdDiscountEnabled;
      additionalCheckoutSessionProperties.referralDiscountEnabled = this.model.referralDiscountEnabled;

      return additionalCheckoutSessionProperties;
    } else {
      return additionalCheckoutSessionProperties;
    }
  }

  get user() {
    return this.authenticator.currentUser;
  }

  @action
  handleStartMembershipButtonClick(pricingFrequency) {
    this.configureCheckoutSessionModalIsOpen = true;
    this.pricingFrequencyClicked = pricingFrequency;
  }

  @action
  async handleTryNowPayLaterButtonClicked() {
    this.analyticsEventTracker.track('dismissed_payment_prompt');
    this.router.transitionTo('tracks');
  }
}
