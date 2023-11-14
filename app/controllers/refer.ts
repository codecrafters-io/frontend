import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class PartnerController extends Controller {
  @service authenticator!: AuthenticatorService;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get freeUsageGrants() {
    // @ts-ignore
    return this.currentUser.freeUsageGrants;
  }

  get referralLink() {
    // @ts-ignore
    return this.currentUser.referralLinks.firstObject;
  }
}
