import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import window from 'ember-window-mock';
import type AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type MonthlyChallengeBannerService from 'codecrafters-frontend/services/monthly-challenge-banner';
import type RouterService from '@ember/routing/router-service';
import type { ModelType } from 'codecrafters-frontend/routes/pay';
import type PromotionalDiscountModel from 'codecrafters-frontend/models/promotional-discount';
import type FeatureFlagsService from 'codecrafters-frontend/services/feature-flags';
import testimonialsData from 'codecrafters-frontend/utils/testimonials-data';
import type { Testimonial } from 'codecrafters-frontend/utils/testimonials-data';
import type { FeatureDescription } from 'codecrafters-frontend/components/pay-page/pricing-plan-card';

export default class PayController extends Controller {
  declare model: ModelType;

  @service declare analyticsEventTracker: AnalyticsEventTrackerService;
  @service declare authenticator: AuthenticatorService;
  @service declare featureFlags: FeatureFlagsService;
  @service declare monthlyChallengeBanner: MonthlyChallengeBannerService;
  @service declare router: RouterService;

  @tracked chooseMembershipPlanModalIsOpen = false;
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

  get discountedYearlyPrice() {
    if (this.activeDiscountForYearlyPlan) {
      return this.activeDiscountForYearlyPlan.computeDiscountedPrice(360);
    } else {
      return null;
    }
  }

  get featureDescriptionsForFreePlan(): FeatureDescription[] {
    return [{ text: 'Limited content access' }, { text: 'Basic community features' }];
  }

  get featureDescriptionsForMembershipPlan(): FeatureDescription[] {
    return [
      { text: 'Unrestricted content access' },
      { text: 'Turbo tests', link: 'https://codecrafters.io/turbo' },
      { text: 'Code examples', link: 'https://docs.codecrafters.io/code-examples' },
      { text: 'Anonymous mode', link: 'https://docs.codecrafters.io/membership/anonymous-mode' },
      { text: 'Dark mode', link: 'https://docs.codecrafters.io/membership/dark-mode' },
      { text: 'Over $1000 in perks', link: 'https://codecrafters.io/perks' },
      { text: 'Priority support' },
    ];
  }

  get featureDescriptionsForTeamsPlan(): FeatureDescription[] {
    return [
      { text: 'All membership features' },
      { text: 'Unlimited seat re-assigns' },
      { text: 'Team leaderboard' },
      { text: 'Team usage analytics' },
      { text: 'Slack app' },
    ];
  }

  get testimonialsForCards(): Testimonial[] {
    return [testimonialsData['connor-murphy']!, testimonialsData['krishna-vaidyanathan']!];
  }

  get user() {
    return this.authenticator.currentUser;
  }

  @action
  handleFreePlanCTAClick() {
    this.requireAuthenticationOr(() => {
      this.router.transitionTo('catalog');
    }, `${window.origin}/catalog`);
  }

  @action
  handleMembershipPlanCTAClick() {
    this.requireAuthenticationOr(() => {
      this.chooseMembershipPlanModalIsOpen = true;
    }, `${window.origin}/pay`);
  }

  @action
  handleTeamsPlanCTAClick() {
    this.requireAuthenticationOr(() => {
      this.router.transitionTo('teams.pay');
    }, `${window.origin}/teams/pay`);
  }

  @action
  async handleTryNowPayLaterButtonClicked() {
    this.analyticsEventTracker.track('dismissed_payment_prompt', {});
    this.router.transitionTo('tracks');
  }

  requireAuthenticationOr(callback: () => void, redirectUrl: string) {
    if (!this.authenticator.isAuthenticated) {
      this.authenticator.initiateLoginAndRedirectTo(redirectUrl);

      return;
    }

    callback();
  }
}
