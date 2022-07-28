import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default class MembershipController extends Controller {
  @service('currentUser') currentUserService;

  get activeSubscription() {
    return this.currentUserService.record.activeSubscription;
  }

  // To use when we handle expired subscriptions
  // get expiredSubscription() {
  //   return this.currentUserService.record.expiredSubscription;
  // }
}
