import Component from '@glimmer/component';
import window from 'ember-window-mock';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class PricingCardComponent extends Component {
  @service store;
  @tracked isCreatingCheckoutSession = false;

  get featureDescriptions() {
    return [
      `200+ hours worth of practice`,
      `Expert approaches for all stages`,
      `Members community for Q&A`,
      `Download invoice for expensing`,
      `Private leaderboard for your team`,
      `Cancel anytime`,
    ];
  }

  @action
  async handleStartPaymentButtonClicked() {
    this.isCreatingCheckoutSession = true;

    let checkoutSession = this.store.createRecord('individual-checkout-session', {
      earlyBirdDiscountEnabled: this.args.earlyBirdDiscountEnabled,
      successUrl: `${window.location.origin}/tracks/go?action=checkout_session_successful`,
      cancelUrl: `${window.location.origin}/pay`,
      pricingFrequency: this.args.pricingFrequency,
    });

    await checkoutSession.save();
    window.location.href = checkoutSession.url;
  }
}
