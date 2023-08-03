import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import testimonialsData from 'codecrafters-frontend/lib/testimonials-data';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class PayController extends Controller {
  @service analyticsEventTracker;
  @service authenticator;
  @service router;
  @tracked isCreatingCheckoutSession = false;
  @tracked shouldApplyRegionalDiscount = false;

  get discountedYearlyPrice() {
    if (this.user.isEligibleForCustomDiscount) {
      return this.user.availableCustomDiscount.discountedYearlyPriceInDollars;
    } else if (this.user.isEligibleForReferralDiscount) {
      return 216;
    } else if (this.user.isEligibleForEarlyBirdDiscount) {
      return 216;
    } else {
      return null;
    }
  }

  @action
  async handleTryNowPayLaterButtonClicked() {
    this.analyticsEventTracker.track('dismissed_payment_prompt');
    this.router.transitionTo('tracks');
  }

  get testimonialGroups() {
    let testimonialGroup1 = [testimonialsData['ananthalakshmi-sankar'], testimonialsData['raghav-dua']];
    let testimonialGroup2 = [testimonialsData['beyang-liu'], testimonialsData['kang-ming-tay']];
    let testimonialGroup3 = [testimonialsData['jonathan-lorimer'], testimonialsData['akshata-mohan']];

    return [testimonialGroup1, testimonialGroup2, testimonialGroup3];
  }

  get user() {
    return this.authenticator.currentUser;
  }
}
