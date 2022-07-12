import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import window from 'ember-window-mock';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class PayController extends Controller {
  @service('currentUser') currentUserService;
  @service router;
  @tracked isCreatingCheckoutSession = false;

  get earlyBirdDiscountEligibilityExpiresAt() {
    return this.currentUserService.record.earlyBirdDiscountEligibilityExpiresAt;
  }

  get userIsEligibleForEarlyBirdDiscount() {
    return this.currentUserService.record.isEligibleForEarlyBirdDiscount;
  }

  get testimonials() {
    return this.model.courses.findBy('slug', 'docker').testimonials;
  }

  @action
  async handleTryNowPayLaterButtonClicked() {
    this.store.createRecord('analytics-event', { name: 'dismissed_payment_prompt' }).save();
    this.router.transitionTo('track', 'go');
  }
}
