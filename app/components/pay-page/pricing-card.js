import Component from '@glimmer/component';
import window from 'ember-window-mock';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class PricingCardComponent extends Component {
  @service authenticator;
  @service store;
  @tracked isCreatingCheckoutSession = false;

  get featureDescriptions() {
    return ['One time payment', 'No limits on content', 'Community features', 'Priority builds', 'Priority support'];
  }

  @action
  async handleStartPaymentButtonClicked() {
    this.isCreatingCheckoutSession = true;

    let checkoutSession = this.store.createRecord('individual-checkout-session', {
      autoRenewSubscription: false, // None of our plans are subscriptions at the moment
      customDiscount: this.args.customDiscount,
      regionalDiscount: this.args.regionalDiscount,
      earlyBirdDiscountEnabled: this.args.earlyBirdDiscountEnabled,
      referralDiscountEnabled: this.args.referralDiscountEnabled,
      successUrl: `${window.location.origin}/tracks`,
      cancelUrl: `${window.location.origin}/pay`,
      pricingFrequency: this.args.pricingFrequency,
    });

    await checkoutSession.save();
    window.location.href = checkoutSession.url;
  }

  get numberOfMonths() {
    if (this.args.pricingFrequency === 'quarterly') {
      return 3;
    } else if (this.args.pricingFrequency === 'yearly') {
      return 12;
    } else {
      throw new Error(`Unknown pricing frequency: ${this.args.pricingFrequency}`);
    }
  }

  get user() {
    return this.authenticator.currentUser;
  }
}
