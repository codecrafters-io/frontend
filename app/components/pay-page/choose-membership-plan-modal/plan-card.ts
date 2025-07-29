import Component from '@glimmer/component';
import { service } from '@ember/service';
import type TimeService from 'codecrafters-frontend/services/time';
import { formatTimeDurationForCountdown } from 'codecrafters-frontend/utils/time-formatting';
import type RegionalDiscountModel from 'codecrafters-frontend/models/regional-discount';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    actualPriceInDollars: number;
    discountedPriceInDollars?: number;
    isSelected: boolean;
    validityInMonths?: number; // Not set for lifetime plans
    title: string;
    activeDiscountForYearlyPlan?: any;
    regionalDiscount?: RegionalDiscountModel | null;
    shouldApplyRegionalDiscount?: boolean;
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

  get effectivePriceInDollars(): number {
    return this.args.discountedPriceInDollars || this.args.actualPriceInDollars;
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
