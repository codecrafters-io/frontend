import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { loadStripe } from '@stripe/stripe-js';

export default class BillingDetailsFormComponent extends Component {
  @tracked errorMessage;
  @tracked stripeElementsObject;

  constructor() {
    super(...arguments);
  }

  @action
  async handleContinueButtonClick() {
    this.errorMessage = null;

    const stripe = await loadStripe('pk_test_51L1aPXJtewx3LJ9VgIiwpt4RL9FX2Yr7RgJCMMpviFmFc4Zrwt2s6lvH8QFMT88exOUvQWh13Thc7oBMVrMlQKwX00qbz9xH2A');
    const { error } = stripe.confirmSetup({ elements: this.stripeElementsObject, confirmParams: { return_url: window.location.href } });

    if (error) {
      this.errorMessage = error.message;
    } else {
      // Stripe redirect...
    }
  }

  @action
  async handleDidInsert() {
    const stripe = await loadStripe('pk_test_51L1aPXJtewx3LJ9VgIiwpt4RL9FX2Yr7RgJCMMpviFmFc4Zrwt2s6lvH8QFMT88exOUvQWh13Thc7oBMVrMlQKwX00qbz9xH2A');
    const options = { clientSecret: 'seti_1LkDjsJtewx3LJ9V5vMLKYvy_secret_MTA4UY0SCrPjuUbREEC85GXWKrvEZTq' };

    // Set up Stripe.js and Elements to use in checkout form, passing the client secret obtained in step 2
    this.stripeElementsObject = stripe.elements(options);

    // Create and mount the Payment Element
    const paymentElement = this.stripeElementsObject.create('payment');
    paymentElement.mount('#payment-element');
  }
}
