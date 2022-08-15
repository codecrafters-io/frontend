import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class MembershipController extends Controller {
  @service('currentUser') currentUserService;
  @tracked isCancellingSubscription = false;

  get activeSubscription() {
    return this.currentUserService.record.activeSubscription;
  }

  get activeOrExpiredSubscription() {
    return this.activeSubscription || this.expiredSubscription;
  }

  get expiredSubscription() {
    return this.currentUserService.record.expiredSubscription;
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
