import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class MembershipController extends Controller {
  @service('authenticator') authenticator;
  @tracked isCancellingSubscription = false;

  get activeOrExpiredSubscription() {
    return this.activeSubscription || this.expiredSubscription;
  }

  get activeSubscription() {
    return this.authenticator.currentUser.activeSubscription;
  }

  get expiredSubscription() {
    return this.authenticator.currentUser.expiredSubscription;
  }

  @action
  handleCancelSubscriptionButtonClick() {
    this.isCancellingSubscription = true;
  }

  @action
  handleCancelSubscriptionModalClose() {
    this.isCancellingSubscription = false;
  }
}
