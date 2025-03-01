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
    return this.currentUser?.activeDiscountFromAffiliateReferral || this.currentUser?.activeDiscountFromSignup || null;
  }

  get badgeType():
    | 'vip'
    | 'member'
    | 'indirect-member'
    | 'discount-timer'
    | 'discount-timer-excluding-stage-2-completion'
    | 'free-weeks-left'
    | 'upgrade' {
    if (this.shouldShowVipBadge) {
      return 'vip';
    }

    if (this.shouldShowMemberBadge) {
      return 'member';
    }

    if (this.currentUser?.canAccessMembershipBenefits) {
      return 'indirect-member';
    }

    // Stage 2 completion discounts gets higher priority
    if (this.activeDiscountForYearlyPlan?.isFromStage2Completion && this.featureFlags.canSeeStage2CompletionDiscount) {
      return 'discount-timer';
    }

    if (this.activeDiscountForYearlyPlan?.isFromSignup || this.activeDiscountForYearlyPlan?.isFromAffiliateReferral) {
      return 'discount-timer-excluding-stage-2-completion';
    }

    if (this.shouldShowFreeWeeksLeftButton) {
      return 'free-weeks-left';
    }

    return 'upgrade';
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
