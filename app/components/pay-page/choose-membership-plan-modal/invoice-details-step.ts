import Component from '@glimmer/component';
import type RegionalDiscountModel from 'codecrafters-frontend/models/regional-discount';
import type PromotionalDiscountModel from 'codecrafters-frontend/models/promotional-discount';
import type { PricingPlan } from '../choose-membership-plan-modal';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    activeDiscountForYearlyPlan: PromotionalDiscountModel | null;
    extraInvoiceDetailsRequested: boolean;
    isCreatingCheckoutSession: boolean;
    onBack: () => void;
    onExtraInvoiceDetailsToggle: (value: boolean) => void;
    onPlanSelect: (plan: PricingPlan) => void;
    onProceedToCheckout: () => void;
    regionalDiscount?: RegionalDiscountModel | null;
    selectedPlan: PricingPlan;
  };
}

export default class InvoiceDetailsStepComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'PayPage::ChooseMembershipPlanModal::InvoiceDetailsStep': typeof InvoiceDetailsStepComponent;
  }
}
