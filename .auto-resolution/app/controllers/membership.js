import Controller from '@ember/controller';
import { service } from '@ember/service';

export default class MembershipController extends Controller {
  @service('authenticator') authenticator;

  get activeOrExpiredSubscription() {
    return this.activeSubscription || this.expiredSubscription;
  }

  get activeSubscription() {
    return this.authenticator.currentUser.activeSubscription;
  }

  get expiredSubscription() {
    return this.authenticator.currentUser.expiredSubscription;
  }
}
