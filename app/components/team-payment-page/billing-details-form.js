import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { loadStripe } from '@stripe/stripe-js';

export default class BillingDetailsFormComponent extends Component {
  @action
  async handleDidInsert() {
    const stripe = await loadStripe('pk_test_51L1aPXJtewx3LJ9VgIiwpt4RL9FX2Yr7RgJCMMpviFmFc4Zrwt2s6lvH8QFMT88exOUvQWh13Thc7oBMVrMlQKwX00qbz9xH2A');
    const options = { clientSecret: 'seti_1LkDjsJtewx3LJ9V5vMLKYvy_secret_MTA4UY0SCrPjuUbREEC85GXWKrvEZTq' };

    // Set up Stripe.js and Elements to use in checkout form, passing the client secret obtained in step 2
    const elements = stripe.elements(options);

    // Create and mount the Payment Element
    const paymentElement = elements.create('payment');
    paymentElement.mount('#payment-element');
  }

  get imageUrl() {
    if (this.avatarImageFailedToLoad) {
      return 'https://codecrafters.io/images/sample-avatar-3.png';
    } else {
      return this.args.user.avatarUrl;
    }
  }
}
