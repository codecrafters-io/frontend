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
    isSelected: boolean;
    onClick: () => void;
    plan: PricingPlan;
    promotionalDiscount: PromotionalDiscountModel | null;
    regionalDiscount: RegionalDiscountModel | null;
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

    if (this.args.promotionalDiscount) {
      discountedPrice = this.args.promotionalDiscount.computeDiscountedPrice(discountedPrice);
    }

    if (this.args.regionalDiscount) {
      discountedPrice = this.args.regionalDiscount.computeDiscountedPrice(discountedPrice);
    }

    return discountedPrice === basePrice ? null : Math.round(discountedPrice);
  }

  get effectivePriceInDollars(): number {
    return this.discountedPriceInDollars || this.args.plan.priceInDollars;
  }

  get timeLeftText(): string {
    if (!this.args.promotionalDiscount) {
      return '';
    }

    return formatTimeDurationForCountdown(this.args.promotionalDiscount.expiresAt, this.time.currentTime);
  }

  @action
  handleClick() {
    this.args.onClick();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'PayPage::ChooseMembershipPlanModal::PlanCard': typeof PlanCard;
  }
}
