import Component from '@glimmer/component';
import config from 'codecrafters-frontend/config/environment';
import { action } from '@ember/object';
import { loadStripe } from '@stripe/stripe-js';
import { tracked } from '@glimmer/tracking';
import type { Stripe, StripeElements } from '@stripe/stripe-js';
import type TeamPaymentFlowModel from 'codecrafters-frontend/models/team-payment-flow';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    teamPaymentFlow: TeamPaymentFlowModel;
    onContinueButtonClick?: () => void;
  };
}

export default class PaymentDetailsStepContainer extends Component<Signature> {
  @tracked declare errorMessage: string | null;
  @tracked declare stripeElementsObject: StripeElements;
  @tracked isConfirmingPaymentDetails = false;
  declare stripeLibObject: Stripe | null;

  @action
  async handleChangePaymentMethodButtonClick() {
    if (window.confirm(`You'll need to enter payment details again. Are you sure?`)) {
      this.isConfirmingPaymentDetails = true; // Piggybacking on this flag to disable the button
      await this.args.teamPaymentFlow.resetPaymentDetails({});
      this.isConfirmingPaymentDetails = false;
    }
  }

  @action
  async handleContinueButtonClick() {
    if (this.isConfirmingPaymentDetails) {
      return;
    }

    if (this.args.teamPaymentFlow.paymentDetailsAreComplete) {
      this.args.onContinueButtonClick?.();
    }

    this.isConfirmingPaymentDetails = true;
    this.errorMessage = null;

    if (config.environment === 'test') {
      this.errorMessage = 'Test error';
      this.isConfirmingPaymentDetails = false;

      return;
    }

    const stripe = await this.stripeLib();

    const confirmSetupResult = await stripe.confirmSetup({
      elements: this.stripeElementsObject,
      confirmParams: { return_url: window.location.href },
    });

    if (confirmSetupResult.error) {
      this.errorMessage = confirmSetupResult.error.message || 'An error occurred';
      this.isConfirmingPaymentDetails = false;
    } else {
      // Redirecting to Stripe
    }
  }

  @action
  async handleDidInsertPaymentForm() {
    const stripe = await this.stripeLib();
    const options = { clientSecret: this.args.teamPaymentFlow.stripeSetupIntentClientSecret };

    if (config.environment === 'test') {
      return;
    }

    // Set up Stripe.js and Elements to use in checkout form, passing the client secret obtained in step 2
    this.stripeElementsObject = stripe.elements(options);

    // Create and mount the Payment Element
    const paymentElement = this.stripeElementsObject.create('payment');
    paymentElement.mount('#payment-element');
  }

  // We need the same shared instance for form errors to work properly
  async stripeLib(): Promise<Stripe> {
    this.stripeLibObject ||= await loadStripe(config.x.stripePublishableKey);

    if (!this.stripeLibObject) {
      throw new Error('Failed to load Stripe');
    }

    return this.stripeLibObject;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TeamPaymentPage::PaymentDetailsStepContainer': typeof PaymentDetailsStepContainer;
  }
}
