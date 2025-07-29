import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import fade from 'ember-animated/transitions/fade';
import type RegionalDiscountModel from 'codecrafters-frontend/models/regional-discount';
import type PromotionalDiscountModel from 'codecrafters-frontend/models/promotional-discount';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    onClose: () => void;
    regionalDiscount?: RegionalDiscountModel | null;
    shouldApplyRegionalDiscount?: boolean;
    activeDiscountForYearlyPlan?: PromotionalDiscountModel | null;
  };
}

export default class ChooseMembershipPlanModal extends Component<Signature> {
  transition = fade;
  @tracked previewType: 'plan' | 'invoice-details' = 'plan';
  @tracked selectedPlan: '3-month' | '1-year' | 'lifetime' = '3-month';

  get selectedPlanText() {
    switch (this.selectedPlan) {
      case '3-month':
        return '3 month pass';
      case '1-year':
        return '1 year pass';
      case 'lifetime':
        return 'Lifetime pass';
      default:
        return '3 month pass';
    }
  }

  @action
  handleChangePlanButtonClick() {
    this.previewType = 'plan';
  }

  @action
  handleChoosePlanButtonClick() {
    this.previewType = 'invoice-details';
  }

  @action
  selectPlan(plan: '3-month' | '1-year' | 'lifetime') {
    this.selectedPlan = plan;
  }

  get discountedYearlyPrice(): number | null {
    const basePrice = 360;
    let discountedPrice = basePrice;

    // Apply promotional discount if available
    if (this.args.activeDiscountForYearlyPlan) {
      discountedPrice = this.args.activeDiscountForYearlyPlan.computeDiscountedPrice(basePrice);
    }

    // Apply regional discount if available and should be applied
    if (this.args.regionalDiscount && this.args.shouldApplyRegionalDiscount) {
      const regionalDiscountAmount = (discountedPrice * this.args.regionalDiscount.percentOff) / 100;
      discountedPrice = discountedPrice - regionalDiscountAmount;
    }

    // Return null if no discount was applied (price is the same as base)
    return discountedPrice === basePrice ? null : Math.round(discountedPrice);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'PayPage::ChooseMembershipPlanModal': typeof ChooseMembershipPlanModal;
  }
}
