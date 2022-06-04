import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import window from 'ember-window-mock';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class PayController extends Controller {
  @service currentUser;
  @service router;
  @tracked isCreatingCheckoutSession = false;

  get testimonials() {
    return this.model.courses.findBy('slug', 'docker').testimonials;
  }

  @action
  async handleStartPaymentButtonClicked() {
    this.isCreatingCheckoutSession = true;

    let checkoutSession = this.store.createRecord('individual-checkout-session', {
      successUrl: `${window.location.origin}/tracks/go?action=checkout_session_successful`,
      cancelUrl: `${window.location.origin}/pay`,
    });

    await checkoutSession.save();
    window.location.href = checkoutSession.url;
  }

  @action
  async handleTryNowPayLaterButtonClicked() {
    this.router.transitionTo('track', 'go');
  }
}
