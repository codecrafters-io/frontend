import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import type AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type MonthlyChallengeBannerService from 'codecrafters-frontend/services/monthly-challenge-banner';
import type RouterService from '@ember/routing/router-service';
import type { ModelType } from 'codecrafters-frontend/routes/pay';
import type PromotionalDiscountModel from 'codecrafters-frontend/models/promotional-discount';
import type FeatureFlagsService from 'codecrafters-frontend/services/feature-flags';

export default class PayController extends Controller {
  declare model: ModelType;

  @service declare analyticsEventTracker: AnalyticsEventTrackerService;
  @service declare authenticator: AuthenticatorService;
  @service declare featureFlags: FeatureFlagsService;
  @service declare monthlyChallengeBanner: MonthlyChallengeBannerService;
  @service declare router: RouterService;

  @tracked configureCheckoutSessionModalIsOpen = false;
  @tracked isCreatingCheckoutSession = false;
  @tracked selectedPricingFrequency = '';
  @tracked shouldApplyRegionalDiscount = false;

  get activeDiscountForYearlyPlan(): PromotionalDiscountModel | null {
    return this.user?.activeDiscountForYearlyPlan || null;
  }

  get additionalCheckoutSessionProperties() {
    return {
      pricingFrequency: this.selectedPricingFrequency,
      promotionalDiscount: this.selectedPricingFrequency === 'yearly' ? this.activeDiscountForYearlyPlan : null,
      regionalDiscount: this.shouldApplyRegionalDiscount ? this.model.regionalDiscount : null,
    };
  }

  get canSeeDiscountCountdown() {
    return this.featureFlags.canSeeDiscountCountdown;
  }

  get discountedYearlyPrice() {
    if (this.activeDiscountForYearlyPlan) {
      return this.activeDiscountForYearlyPlan.computeDiscountedPrice(360);
    } else {
      return null;
    }
  }

  get user() {
    return this.authenticator.currentUser;
  }

  @action
  handleStartMembershipButtonClick(pricingFrequency: string) {
    if (this.authenticator.isAuthenticated) {
      this.configureCheckoutSessionModalIsOpen = true;
      this.selectedPricingFrequency = pricingFrequency;
    } else {
      this.authenticator.initiateLogin(null);
    }
  }

  @action
  async handleTryNowPayLaterButtonClicked() {
    this.analyticsEventTracker.track('dismissed_payment_prompt', {});
    this.router.transitionTo('tracks');
  }
}
