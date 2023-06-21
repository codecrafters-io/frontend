import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class UserController extends Controller {
  @service authenticator;

  get currentUser() {
    return this.authenticator.currentUser;
  }
}
