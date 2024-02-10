import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import type AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type MonthlyChallengeBannerService from 'codecrafters-frontend/services/monthly-challenge-banner';
import type RouterService from '@ember/routing/router-service';
import type { ModelType } from 'codecrafters-frontend/routes/pay';
import type UserModel from 'codecrafters-frontend/models/user';

export default class PayController extends Controller {
  declare model: ModelType;

  @service declare analyticsEventTracker: AnalyticsEventTrackerService;
  @service declare authenticator: AuthenticatorService;
  @service declare monthlyChallengeBanner: MonthlyChallengeBannerService;
  @service declare router: RouterService;

  @tracked configureCheckoutSessionModalIsOpen = false;
  @tracked isCreatingCheckoutSession = false;
  @tracked selectedPricingFrequency = '';
  @tracked shouldApplyRegionalDiscount = false;

  get additionalCheckoutSessionProperties() {
    return {
      pricingFrequency: this.selectedPricingFrequency,
      regionalDiscount: this.shouldApplyRegionalDiscount ? this.model.regionalDiscount : null,
      earlyBirdDiscountEnabled: this.selectedPricingFrequency === 'yearly' && this.user.isEligibleForEarlyBirdDiscount,
      referralDiscountEnabled: this.selectedPricingFrequency === 'yearly' && this.user.isEligibleForReferralDiscount,
    };
  }

  get discountedYearlyPrice() {
    if (this.user.isEligibleForReferralDiscount) {
      return 216;
    } else if (this.user.isEligibleForEarlyBirdDiscount) {
      return 216;
    } else {
      return null;
    }
  }

  get user() {
    return this.authenticator.currentUser as UserModel; // pay route is protected by auth, so currentUser is guaranteed to be a UserModel
  }

  @action
  handleStartMembershipButtonClick(pricingFrequency: string) {
    this.configureCheckoutSessionModalIsOpen = true;
    this.selectedPricingFrequency = pricingFrequency;
  }

  @action
  async handleTryNowPayLaterButtonClicked() {
    this.analyticsEventTracker.track('dismissed_payment_prompt', {});
    this.router.transitionTo('tracks');
  }
}
