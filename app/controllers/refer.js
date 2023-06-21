import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class ReferController extends Controller {
  @service authenticator;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get referralLink() {
    return this.currentUser.referralLinks.firstObject;
  }
}
