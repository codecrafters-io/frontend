import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class CurrentUserService extends Service {
  @service serverVariables;
  @service store;

  async authenticate() {
    await this.store.pushPayload({ data: this.currentUserPayload });
  }

  get currentUserPayload() {
    return JSON.parse(this.serverVariables.get('currentUserPayload'));
  }

  get currentUserId() {
    return this.currentUserPayload.id;
  }

  get record() {
    return this.store.peekRecord('user', this.currentUserId);
  }
}
