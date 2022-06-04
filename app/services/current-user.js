import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class CurrentUserService extends Service {
  @service serverVariables;
  @service store;

  authenticate() {
    if (!this.isAuthenticated) {
      return;
    }

    let dupedPayload = JSON.parse(JSON.stringify(this.currentUserPayload));
    this.store.pushPayload(dupedPayload);
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

  get isAnonymous() {
    return !this.isAuthenticated;
  }

  get isAuthenticated() {
    return !!this.currentUserPayload;
  }

  get isSubscriber() {
    return this.isAuthenticated && !!this.record.hasActiveSubscription;
  }

  get record() {
    return this.store.peekRecord('user', this.currentUserId);
  }
}
