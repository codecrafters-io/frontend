import Controller from '@ember/controller';
import testimonialsData from 'codecrafters-frontend/utils/testimonials-data';
import type AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type FeatureFlagsService from 'codecrafters-frontend/services/feature-flags';
import type MonthlyChallengeBannerService from 'codecrafters-frontend/services/monthly-challenge-banner';
import type PromotionalDiscountModel from 'codecrafters-frontend/models/promotional-discount';
import type RegionalDiscountModel from 'codecrafters-frontend/models/regional-discount';
import type RouterService from '@ember/routing/router-service';
import type Store from '@ember-data/store';
import type { FeatureDescription } from 'codecrafters-frontend/components/pay-page/pricing-plan-card';
import type { ModelType } from 'codecrafters-frontend/routes/pay';
import type { Testimonial } from 'codecrafters-frontend/utils/testimonials-data';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { waitFor } from '@ember/test-waiters';
import fade from 'ember-animated/transitions/fade';

export default class PayController extends Controller {
  fade = fade;

  declare model: ModelType;

  @service declare analyticsEventTracker: AnalyticsEventTrackerService;
  @service declare authenticator: AuthenticatorService;
  @service declare featureFlags: FeatureFlagsService;
  @service declare monthlyChallengeBanner: MonthlyChallengeBannerService;
  @service declare router: RouterService;
  @service declare store: Store;

  queryParams = [{ chooseMembershipPlanModalIsOpen: 'plans' }];

  @tracked chooseMembershipPlanModalIsOpen: string | undefined = undefined;
  @tracked regionalDiscount: RegionalDiscountModel | null = null;

  get activeDiscountForYearlyPlan(): PromotionalDiscountModel | null {
    return this.user?.activeDiscountForYearlyPlan || null;
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
  handleChooseMembershipPlanModalClose() {
    this.router.transitionTo('pay', { queryParams: { plans: undefined } });
  }

  @action
  @waitFor
  async handleDidInsertContainer() {
    this.regionalDiscount = await this.store.createRecord('regional-discount').fetchCurrent();
  }

  @action
  handleFreePlanCTAClick() {
    this.router.transitionTo('catalog');
  }

  @action
  handleMembershipPlanCTAClick() {
    this.router.transitionTo('pay', { queryParams: { plans: 'true' } });
  }

  @action
  handleTeamsPlanCTAClick() {
    this.router.transitionTo('teams.pay');
  }
}
