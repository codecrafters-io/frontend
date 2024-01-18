import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class PartnerController extends Controller {
  @service authenticator;

  get affiliateLink() {
    return this.currentUser.affiliateLinks[0];
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }
}
