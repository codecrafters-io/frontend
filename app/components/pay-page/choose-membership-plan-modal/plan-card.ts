import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import type TimeService from 'codecrafters-frontend/services/time';
import { formatTimeDurationForCountdown } from 'codecrafters-frontend/utils/time-formatting';
import type RegionalDiscountModel from 'codecrafters-frontend/models/regional-discount';
import type PromotionalDiscountModel from 'codecrafters-frontend/models/promotional-discount';
import type { PricingPlan } from '../choose-membership-plan-modal';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    activeDiscountForYearlyPlan?: PromotionalDiscountModel | null;
    isSelected: boolean;
    onPlanSelect: (plan: PricingPlan) => void;
    plan: PricingPlan;
    regionalDiscount?: RegionalDiscountModel | null;
  };
}

export default class PlanCard extends Component<Signature> {
  @service declare time: TimeService;

  get amortizedMonthlyPriceInDollars(): number | null {
    if (this.args.plan.validityInMonths) {
      return Math.round(this.effectivePriceInDollars / this.args.plan.validityInMonths);
    }

    return null;
  }

  get discountedPriceInDollars(): number | null {
    const basePrice = this.args.plan.priceInDollars;
    let discountedPrice = basePrice;

    // Apply promotional discount first (yearly plans only)
    if (this.args.activeDiscountForYearlyPlan && this.args.plan.id === 'yearly') {
      discountedPrice = this.args.activeDiscountForYearlyPlan.computeDiscountedPrice(basePrice);
    }

    // Apply regional discount
    if (this.args.regionalDiscount) {
      const regionalDiscountAmount = (discountedPrice * this.args.regionalDiscount.percentOff) / 100;
      discountedPrice = discountedPrice - regionalDiscountAmount;
    }

    return discountedPrice === basePrice ? null : Math.round(discountedPrice);
  }

  get effectivePriceInDollars(): number {
    return this.discountedPriceInDollars || this.args.plan.priceInDollars;
  }

  get timeLeftText(): string {
    if (!this.args.activeDiscountForYearlyPlan) {
      return '';
    }

    return formatTimeDurationForCountdown(this.args.activeDiscountForYearlyPlan.expiresAt, this.time.currentTime);
  }

  @action
  handleClick() {
    this.args.onPlanSelect(this.args.plan);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'PayPage::ChooseMembershipPlanModal::PlanCard': typeof PlanCard;
  }
}
