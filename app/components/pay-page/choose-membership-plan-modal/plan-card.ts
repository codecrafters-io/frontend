import Component from '@glimmer/component';
import { service } from '@ember/service';
import type TimeService from 'codecrafters-frontend/services/time';
import { formatTimeDurationForCountdown } from 'codecrafters-frontend/utils/time-formatting';
import type RegionalDiscountModel from 'codecrafters-frontend/models/regional-discount';
import type PromotionalDiscountModel from 'codecrafters-frontend/models/promotional-discount';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    actualPriceInDollars: number;
    isSelected: boolean;
    validityInMonths?: number; // Not set for lifetime plans
    title: string;
    activeDiscountForYearlyPlan?: PromotionalDiscountModel | null;
    regionalDiscount?: RegionalDiscountModel | null;
  };
}

export default class PlanCard extends Component<Signature> {
  @service declare time: TimeService;

  get amortizedMonthlyPriceInDollars(): number | null {
    if (this.args.validityInMonths) {
      return Math.round(this.effectivePriceInDollars / this.args.validityInMonths);
    }

    return null;
  }

  get discountedPriceInDollars(): number | null {
    const basePrice = this.args.actualPriceInDollars;
    let discountedPrice = basePrice;

    // Apply promotional discount first (yearly plans only)
    if (this.args.activeDiscountForYearlyPlan && this.args.validityInMonths === 12) {
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
    return this.discountedPriceInDollars || this.args.actualPriceInDollars;
  }

  get timeLeftText(): string {
    if (!this.args.activeDiscountForYearlyPlan) {
      return '';
    }

    return formatTimeDurationForCountdown(this.args.activeDiscountForYearlyPlan.expiresAt, this.time.currentTime);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'PayPage::ChooseMembershipPlanModal::PlanCard': typeof PlanCard;
  }
}
