import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Controller from '@ember/controller';
import FreeUsageGrantModel from 'codecrafters-frontend/models/free-usage-grant';
import { inject as service } from '@ember/service';

export default class ReferController extends Controller {
  declare model: { freeUsageGrants: FreeUsageGrantModel[] };

  @service authenticator!: AuthenticatorService;

  get currentUser() {
    return this.authenticator.currentUser;
  }
  get referralLink() {
    return this.currentUser?.referralLinks[0];
  }
}
