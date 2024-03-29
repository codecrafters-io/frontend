import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import type { ModelType } from 'codecrafters-frontend/routes/user';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

export default class UserController extends Controller {
  declare model: ModelType;

  @service declare authenticator: AuthenticatorService;

  get currentUser() {
    return this.authenticator.currentUser;
  }
}
