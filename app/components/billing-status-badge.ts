import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type FeatureFlagsService from 'codecrafters-frontend/services/feature-flags';
import type RouterService from '@ember/routing/router-service';
import type UserModel from 'codecrafters-frontend/models/user';
import type PromotionalDiscountModel from 'codecrafters-frontend/models/promotional-discount';

interface Signature {
  Element: HTMLDivElement;
  Args: {
    size: 'small' | 'large';
  };
}

export default class BillingStatusDisplayComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare featureFlags: FeatureFlagsService;
  @service declare router: RouterService;

  get activeDiscountForYearlyPlan(): PromotionalDiscountModel | null {
    return this.currentUser?.activeDiscountForYearlyPlan || null;
  }

  get activeDiscountForYearlyPlanExcludingStage2CompletionDiscount(): PromotionalDiscountModel | null {
    return this.currentUser?.activeDiscountForYearlyPlanExcludingStage2CompletionDiscount || null;
  }

  get canSeeDiscountCountdown() {
    return this.featureFlags.canSeeDiscountCountdown;
  }

  get canSeeStage2CompletionDiscount() {
    return this.featureFlags.canSeeStage2CompletionDiscount;
  }

  get currentUser(): UserModel | null {
    return this.authenticator.currentUser;
  }

  get linkButtonSize() {
    // arg:small -> PrimaryLinkButton size:extra-small
    // arg:large -> small
    return this.args.size === 'large' ? 'small' : 'extra-small';
  }

  get shouldShowFreeWeeksLeftButton(): boolean {
    return (
      !!this.currentUser &&
      !this.currentUser.canAccessMembershipBenefits &&
      this.currentUser.hasActiveFreeUsageGrants &&
      !this.currentUser.hasActiveFreeUsageGrantsValueIsOutdated
    );
  }

  get shouldShowMemberBadge(): boolean {
    return !!this.currentUser && this.currentUser.hasActiveSubscription;
  }

  get shouldShowUpgradeButton(): boolean {
    if (this.currentUser) {
      return !this.currentUser.canAccessPaidContent && this.router.currentRouteName !== 'pay';
    } else {
      return true;
    }
  }

  get shouldShowVipBadge(): boolean {
    return !!this.currentUser && this.currentUser.isVip;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    BillingStatusBadge: typeof BillingStatusDisplayComponent;
  }
}
