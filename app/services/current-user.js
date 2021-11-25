import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class CurrentUserService extends Service {
  @service serverVariables;
  @service store;

  async authenticate() {
    await this.store.pushPayload(this.currentUserPayload);
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
  get hasActiveSubscription() {
    return this.record.hasActiveSubscription;
  }

  get isBetaParticipant() {
    return this.record.isBetaParticipant;
  }

  get record() {
    return this.store.peekRecord('user', this.currentUserId);
  }
}
