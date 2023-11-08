import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class ReferController extends Controller {
  @service authenticator;

  get affiliateLink() {
    return this.currentUser.affiliateLinks.firstObject;
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }
}
