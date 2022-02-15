import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class CurrentUserService extends Service {
  @service serverVariables;
  @service store;

  async authenticate() {
    let dupedPayload = JSON.parse(JSON.stringify(this.currentUserPayload));
    await this.store.pushPayload(dupedPayload);
  }

  get currentUserPayload() {
    return this.serverVariables.get('currentUserPayload');
  }

  get currentUserId() {
    return this.currentUserPayload.data.id;
  }

  get currentUserUsername() {
    return this.currentUserPayload.data.attributes.username;
  }

  get record() {
    return this.store.peekRecord('user', this.currentUserId);
  }
}
