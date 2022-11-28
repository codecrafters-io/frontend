import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class PayController extends Controller {
  @service('currentUser') currentUserService;
  @service router;
  @service store;
  @tracked isCreatingCheckoutSession = false;

  get discountedYearlyPrice() {
    if (this.user.isEligibleForEarlyBirdDiscount) {
      return 594;
    } else if (this.user.isEligibleForReferralDiscount) {
      return 590;
    } else {
      return null;
    }
  }

  @action
  async handleTryNowPayLaterButtonClicked() {
    this.store.createRecord('analytics-event', { name: 'dismissed_payment_prompt' }).save();
    this.router.transitionTo('tracks');
  }

  get testimonials() {
    return this.model.courses.findBy('slug', 'docker').testimonials;
  }

  get user() {
    return this.currentUserService.record;
  }
}
