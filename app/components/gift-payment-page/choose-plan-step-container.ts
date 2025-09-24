import Component from '@glimmer/component';
import { action } from '@ember/object';
import type GiftPaymentFlowModel from 'codecrafters-frontend/models/gift-payment-flow';
import { next } from '@ember/runloop';

export interface PricingPlan {
  id: 'quarterly' | 'yearly' | 'lifetime';
  title: string;
  priceInDollars: number;
  validityInMonths?: number;
}

export const GIFT_PRICING_PLANS: PricingPlan[] = [
  { id: 'quarterly', title: '3 months', priceInDollars: 120, validityInMonths: 3 },
  { id: 'yearly', title: '1 year', priceInDollars: 360, validityInMonths: 12 },
  { id: 'lifetime', title: 'Lifetime', priceInDollars: 1490 },
];

interface Signature {
  Element: HTMLDivElement;

  Args: {
    giftPaymentFlow: GiftPaymentFlowModel;
    onContinueButtonClick: () => void;
  };
}

export default class ChoosePlanStepContainer extends Component<Signature> {
  pricingPlans = GIFT_PRICING_PLANS;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);

    if (!this.validPricingPlanIds.includes(this.args.giftPaymentFlow.pricingPlanId)) {
      next(() => {
        this.args.giftPaymentFlow.pricingPlanId = 'yearly';
      });
    }
  }

  get validPricingPlanIds(): string[] {
    return this.pricingPlans.map((plan) => plan.id);
  }

  @action
  async handleContinueButtonClick() {
    // TODO: Save
    this.args.onContinueButtonClick();
  }

  @action
  handlePlanSelect(plan: PricingPlan) {
    this.args.giftPaymentFlow.pricingPlanId = plan.id;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'GiftPaymentPage::ChoosePlanStepContainer': typeof ChoosePlanStepContainer;
  }
}
