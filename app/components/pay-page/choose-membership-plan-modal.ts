import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import fade from 'ember-animated/transitions/fade';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import window from 'ember-window-mock';
import * as Sentry from '@sentry/ember';
import type RegionalDiscountModel from 'codecrafters-frontend/models/regional-discount';
import type PromotionalDiscountModel from 'codecrafters-frontend/models/promotional-discount';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

export interface PricingPlan {
  id: 'quarterly' | 'yearly' | 'lifetime';
  title: string;
  priceInDollars: number;
  validityInMonths?: number; // undefined for lifetime
}

export const PRICING_PLANS: PricingPlan[] = [
  { id: 'quarterly', title: '3 months', priceInDollars: 120, validityInMonths: 3 },
  { id: 'yearly', title: '1 year', priceInDollars: 360, validityInMonths: 12 },
  { id: 'lifetime', title: 'Lifetime', priceInDollars: 1490 },
];

interface Signature {
  Element: HTMLDivElement;

  Args: {
    activeDiscountForYearlyPlan: PromotionalDiscountModel | null;
    onClose: () => void;
    regionalDiscount?: RegionalDiscountModel | null;
  };
}

export default class ChooseMembershipPlanModal extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  transition = fade;
  pricingPlans = PRICING_PLANS;

  @tracked currentStep: 'plan-selection' | 'invoice-details' = 'plan-selection';
  @tracked extraInvoiceDetailsRequested = false;
  @tracked isCreatingCheckoutSession = false;
  @tracked selectedPlanId: PricingPlan['id'] = 'quarterly';

  get selectedPlan(): PricingPlan {
    const plan = this.pricingPlans.find((p) => p.id === this.selectedPlanId);

    if (!plan) {
      Sentry.captureException(new Error(`Unknown selectedPlanId: ${this.selectedPlanId}`));

      return this.pricingPlans[0]!;
    }

    return plan;
  }

  @action
  handleBackButtonClick() {
    this.currentStep = 'plan-selection';
  }

  @action
  handleContinueButtonClick() {
    if (!this.authenticator.isAuthenticated) {
      this.authenticator.initiateLoginAndRedirectTo(`${window.location.origin}/pay`);

      return;
    }

    this.currentStep = 'invoice-details';
  }

  @action
  handleExtraInvoiceDetailsToggle(value: boolean) {
    this.extraInvoiceDetailsRequested = value;
  }

  @action
  handlePlanSelect(plan: PricingPlan) {
    this.selectedPlanId = plan.id;
  }

  @action
  async handleProceedToCheckoutClick() {
    this.isCreatingCheckoutSession = true;

    const checkoutSession = this.store.createRecord('individual-checkout-session', {
      cancelUrl: `${window.location.origin}/pay`,
      extraInvoiceDetailsRequested: this.extraInvoiceDetailsRequested,
      pricingFrequency: this.selectedPlanId,
      promotionalDiscount: this.selectedPlanId === 'yearly' ? this.args.activeDiscountForYearlyPlan : null,
      regionalDiscount: this.args.regionalDiscount || null,
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
