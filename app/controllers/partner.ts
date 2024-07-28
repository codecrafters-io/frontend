import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import type AffiliateLinkModel from 'codecrafters-frontend/models/affiliate-link';
import type UserModel from 'codecrafters-frontend/models/user';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

export default class PartnerController extends Controller {
  @service declare authenticator: AuthenticatorService;

  get affiliateLink() {
    return this.currentUser.affiliateLinks[0] as AffiliateLinkModel; // We know the user has an affiliate link at this point
  }

  get currentUser() {
    return this.authenticator.currentUser as UserModel; // We know the user is authed at this point
  }
}
