import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class CurrentUserService extends Service {
  @service session;
  @service store;

  get currentUser() {
    return this.store.peekRecord('user', this.session.data.authenticated.id);
  }
}
