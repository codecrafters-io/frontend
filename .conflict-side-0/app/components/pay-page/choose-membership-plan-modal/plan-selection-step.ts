import Component from '@glimmer/component';
import type RegionalDiscountModel from 'codecrafters-frontend/models/regional-discount';
import type PromotionalDiscountModel from 'codecrafters-frontend/models/promotional-discount';
import type { PricingPlan } from '../choose-membership-plan-modal';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    activeDiscountForYearlyPlan: PromotionalDiscountModel | null;
    closeModalCTAText: string;
    onCloseModalCTAClick: () => void;
    onChoosePlanButtonClick: () => void;
    onPlanSelect: (plan: PricingPlan) => void;
    pricingPlans: PricingPlan[];
    regionalDiscount: RegionalDiscountModel | null;
    selectedPlan: PricingPlan;
  };
}

export default class PlanSelectionStep extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'PayPage::ChooseMembershipPlanModal::PlanSelectionStep': typeof PlanSelectionStep;
  }
}
