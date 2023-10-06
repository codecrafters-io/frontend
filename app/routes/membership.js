import BaseRoute from 'codecrafters-frontend/lib/base-route';
import { inject as service } from '@ember/service';

export default class MembershipRoute extends BaseRoute {
  @service store;
  @service router;
  @service authenticator;

  afterModel() {
    // Force a sync of subscriptions
    this.store.findAll('subscription');
  }

  async model() {
    await this.authenticator.authenticate();

    if (this.authenticator.currentUser && this.authenticator.currentUser.subscriptions.length === 0) {
      this.router.transitionTo('pay');
    }
  }
}
