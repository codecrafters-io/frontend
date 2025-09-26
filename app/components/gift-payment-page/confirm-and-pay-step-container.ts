import Component from '@glimmer/component';
import type GiftPaymentFlowModel from 'codecrafters-frontend/models/gift-payment-flow';
import type { PricingPlan } from 'codecrafters-frontend/components/pay-page/choose-membership-plan-modal';
import { PRICING_PLANS } from 'codecrafters-frontend/components/pay-page/choose-membership-plan-modal';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import window from 'ember-window-mock';
import { waitFor } from '@ember/test-waiters';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    giftPaymentFlow: GiftPaymentFlowModel;
    onNavigationItemClick: (step: number) => void;
  };
}

export default class ConfirmAndPayStepContainer extends Component<Signature> {
  @tracked errorMessage: string | null = null;
  @tracked isProcessingPayment = false;

  pricingPlans = PRICING_PLANS;

  get selectedPlan(): PricingPlan | null {
    const plan = this.pricingPlans.find((p) => p.id === this.args.giftPaymentFlow.pricingPlanId);

    return plan || null;
  }

  get totalAmount(): number {
    return this.selectedPlan?.priceInDollars || 0;
  }

  @action
  @waitFor
  async handlePaymentButtonClick() {
    this.errorMessage = null;
    this.isProcessingPayment = true;

    try {
      await this.processPaymentTask.perform();
    } catch {
      this.errorMessage = 'Payment failed. Please try again.';
      this.isProcessingPayment = false;
    }
  }

  processPaymentTask = task({ keepLatest: true }, async (): Promise<void> => {
    const successUrl = `${window.location.origin}/gifts/success`;
    const cancelUrl = `${window.location.origin}/gifts/buy?f=${this.args.giftPaymentFlow.id}`;

    const response = await this.args.giftPaymentFlow.generateCheckoutSession({
      successUrl,
      cancelUrl,
    });

    window.location.href = response.link;
  });
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'GiftPaymentPage::ConfirmAndPayStepContainer': typeof ConfirmAndPayStepContainer;
  }
}
