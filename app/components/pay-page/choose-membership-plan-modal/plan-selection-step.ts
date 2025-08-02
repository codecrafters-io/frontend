import Component from '@glimmer/component';
import type RegionalDiscountModel from 'codecrafters-frontend/models/regional-discount';
import type PromotionalDiscountModel from 'codecrafters-frontend/models/promotional-discount';
import type { PricingPlan } from '../choose-membership-plan-modal';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    activeDiscountForYearlyPlan: PromotionalDiscountModel | null;
    onClose: () => void;
    onContinue: () => void;
    onPlanSelect: (plan: PricingPlan) => void;
    pricingPlans: PricingPlan[];
    regionalDiscount?: RegionalDiscountModel | null;
    selectedPlan: PricingPlan;
    selectedPlanId: PricingPlan['id'];
  };
}

export default class PlanSelectionStepComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'PayPage::ChooseMembershipPlanModal::PlanSelectionStep': typeof PlanSelectionStepComponent;
  }
}
