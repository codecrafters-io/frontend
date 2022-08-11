import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default class MembershipController extends Controller {
  @service('currentUser') currentUserService;

  get activeSubscription() {
    return this.currentUserService.record.activeSubscription;
  }

  get activeOrExpiredSubscription() {
    return this.activeSubscription || this.expiredSubscription;
  }

  get expiredSubscription() {
    return this.currentUserService.record.expiredSubscription;
  }
}
