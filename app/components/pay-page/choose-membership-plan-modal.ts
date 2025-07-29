import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import fade from 'ember-animated/transitions/fade';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import window from 'ember-window-mock';
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
  @service declare store: Store;
  
  transition = fade;
  @tracked previewType: 'plan' | 'invoice-details' = 'plan';
  @tracked selectedPlan: '3-month' | '1-year' | 'lifetime' = '3-month';
  @tracked extraInvoiceDetailsRequested = false;
  @tracked isCreatingCheckoutSession = false;

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

  get pricingFrequency(): 'quarterly' | 'yearly' | 'lifetime' {
    return this.selectedPlan === '3-month' ? 'quarterly' : 
           this.selectedPlan === '1-year' ? 'yearly' : 'lifetime';
  }

  @action
  async handleProceedToCheckoutButtonClick(pricingFrequency: 'quarterly' | 'yearly' | 'lifetime') {
    this.isCreatingCheckoutSession = true;

    const checkoutSession = this.store.createRecord('individual-checkout-session', {
      cancelUrl: `${window.location.origin}/pay`,
      extraInvoiceDetailsRequested: this.extraInvoiceDetailsRequested,
      pricingFrequency,
      promotionalDiscount: pricingFrequency === 'yearly' ? this.args.activeDiscountForYearlyPlan || null : null,
      regionalDiscount: this.args.shouldApplyRegionalDiscount ? this.args.regionalDiscount || null : null,
      successUrl: `${window.location.origin}/settings/billing`,
    });

    await checkoutSession.save();
    window.location.href = checkoutSession.url;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'PayPage::ChooseMembershipPlanModal': typeof ChooseMembershipPlanModal;
  }
}
