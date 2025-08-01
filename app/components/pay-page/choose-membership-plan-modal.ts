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

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    onClose: () => void;
    regionalDiscount?: RegionalDiscountModel | null;
    activeDiscountForYearlyPlan?: PromotionalDiscountModel | null;
  };
}

export default class ChooseMembershipPlanModal extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  transition = fade;

  @tracked extraInvoiceDetailsRequested = false;
  @tracked isCreatingCheckoutSession = false;
  @tracked currentStep: 'plan' | 'invoice-details' = 'plan';
  @tracked selectedPlan: '3-month' | '1-year' | 'lifetime' = '3-month';

  get pricingFrequency(): 'quarterly' | 'yearly' | 'lifetime' {
    return this.selectedPlan === '3-month' ? 'quarterly' : this.selectedPlan === '1-year' ? 'yearly' : 'lifetime';
  }

  get selectedPlanText() {
    switch (this.selectedPlan) {
      case '3-month':
        return '3 month pass';
      case '1-year':
        return '1 year pass';
      case 'lifetime':
        return 'Lifetime pass';
      default:
        Sentry.captureException(new Error(`Unknown selectedPlan value: ${this.selectedPlan}`));
        throw new Error(`Unknown selectedPlan value: ${this.selectedPlan}`);
    }
  }

  @action
  handleChangePlanButtonClick() {
    this.currentStep = 'plan';
  }

  @action
  handleChoosePlanButtonClick() {
    this.currentStep = 'invoice-details';
  }

  @action
  handlePlanSelection(plan: '3-month' | '1-year' | 'lifetime') {
    this.selectedPlan = plan;
  }

  @action
  async handleProceedToCheckoutButtonClick(pricingFrequency: 'quarterly' | 'yearly' | 'lifetime') {
    if (!this.authenticator.isAuthenticated) {
      this.authenticator.initiateLoginAndRedirectTo(`${window.location.origin}/pay`);

      return;
    }

    this.isCreatingCheckoutSession = true;

    const checkoutSession = this.store.createRecord('individual-checkout-session', {
      cancelUrl: `${window.location.origin}/pay`,
      extraInvoiceDetailsRequested: this.extraInvoiceDetailsRequested,
      pricingFrequency,
      promotionalDiscount: pricingFrequency === 'yearly' ? this.args.activeDiscountForYearlyPlan || null : null,
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
