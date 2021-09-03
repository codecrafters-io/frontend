import Base from 'ember-simple-auth/authenticators/base';
import { inject as service } from '@ember/service';

export default class CustomAuthenticator extends Base {
  @service store;
  @service serverVariables;

  async authenticate() {
    this.store.pushPayload({ data: this.currentUserPayload });

    return { id: this.currentUserId };
  }

  get currentUserPayload() {
    return JSON.parse(this.serverVariables.get('currentUserPayload'));
  }

  get currentUserId() {
    return this.currentUserPayload.id;
  }

  invalidate() {
    // TODO: Implement this!
  }

  async restore() {
    this.store.pushPayload({ data: this.currentUserPayload });

    return { id: this.currentUserId };
  }
}
