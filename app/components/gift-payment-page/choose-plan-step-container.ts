import Component from '@glimmer/component';
import type GiftPaymentFlowModel from 'codecrafters-frontend/models/gift-payment-flow';
import type { PricingPlan } from 'codecrafters-frontend/components/pay-page/choose-membership-plan-modal';
import { PRICING_PLANS } from 'codecrafters-frontend/components/pay-page/choose-membership-plan-modal';
import { action } from '@ember/object';
import { next } from '@ember/runloop';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    giftPaymentFlow: GiftPaymentFlowModel;
    onContinueButtonClick: () => void;
  };
}

export default class ChoosePlanStepContainer extends Component<Signature> {
  @tracked isProcessingContinueButtonClick = false;

  pricingPlans = PRICING_PLANS;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);

    if (!this.validPricingPlanIds.includes(this.args.giftPaymentFlow.pricingPlanId)) {
      next(() => {
        this.args.giftPaymentFlow.pricingPlanId = 'yearly';
      });
    }
  }

  get selectedPlan(): PricingPlan | null {
    const plan = this.pricingPlans.find((p) => p.id === this.args.giftPaymentFlow.pricingPlanId);

    return plan || null;
  }

  get validPricingPlanIds(): string[] {
    return this.pricingPlans.map((plan) => plan.id);
  }

  @action
  async handleContinueButtonClick() {
    this.isProcessingContinueButtonClick = true;
    await this.saveGiftPaymentFlowTask.perform();
    this.args.onContinueButtonClick();
  }

  @action
  async handlePlanSelect(plan: PricingPlan) {
    this.args.giftPaymentFlow.pricingPlanId = plan.id;
    await this.saveGiftPaymentFlowTask.perform();
  }

  saveGiftPaymentFlowTask = task({ keepLatest: true }, async (): Promise<void> => {
    await this.args.giftPaymentFlow.save();
  });
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'GiftPaymentPage::ChoosePlanStepContainer': typeof ChoosePlanStepContainer;
  }
}
