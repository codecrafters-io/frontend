import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import window from 'ember-window-mock';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class PayController extends Controller {
  @service currentUser;
  @tracked isCreatingCheckoutSession = false;

  get testimonials() {
    return this.model.courses.findBy('slug', 'docker').testimonials;
  }

  @action
  async handleSubscribeButtonClick() {
    this.isCreatingCheckoutSession = true;
    let checkoutSession = this.store.createRecord('checkout-session');
    await checkoutSession.save();
    window.location.href = checkoutSession.url;
  }
}
