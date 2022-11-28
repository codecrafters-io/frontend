import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class ReferController extends Controller {
  @service('current-user') currentUserService;

  get currentUser() {
    return this.currentUserService.record;
  }

  get referralLink() {
    return this.currentUser.referralLinks.firstObject;
  }
}
