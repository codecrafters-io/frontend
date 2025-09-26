import Component from '@glimmer/component';
import type GiftPaymentFlowModel from 'codecrafters-frontend/models/gift-payment-flow';
import type { PricingPlan } from 'codecrafters-frontend/components/pay-page/choose-membership-plan-modal';
import { PRICING_PLANS } from 'codecrafters-frontend/components/pay-page/choose-membership-plan-modal';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

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
    // TODO: Implement actual payment processing
    // This would typically involve:
    // 1. Creating a checkout session with Stripe
    // 2. Redirecting to Stripe Checkout
    // 3. Handling the success/cancel redirects

    // For now, simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
  });
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'GiftPaymentPage::ConfirmAndPayStepContainer': typeof ConfirmAndPayStepContainer;
  }
}
