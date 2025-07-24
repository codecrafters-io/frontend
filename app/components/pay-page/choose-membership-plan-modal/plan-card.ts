import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    actualPriceInDollars: number;
    discountedPriceInDollars?: number;
    isSelected: boolean;
    validityInMonths?: number; // Not set for lifetime plans
    title: string;
  };
}

export default class PlanCard extends Component<Signature> {
  get amortizedMonthlyPriceInDollars(): number | null {
    if (this.args.validityInMonths) {
      return Math.round(this.effectivePriceInDollars / this.args.validityInMonths);
    }

    return null;
  }

  get effectivePriceInDollars(): number {
    return this.args.discountedPriceInDollars || this.args.actualPriceInDollars;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'PayPage::ChooseMembershipPlanModal::PlanCard': typeof PlanCard;
  }
}
