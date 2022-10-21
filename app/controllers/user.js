import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class UserController extends Controller {
  @service('current-user') currentUserService;

  get currentUser() {
    return this.currentUserService.record;
  }
}
