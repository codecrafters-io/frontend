import ApplicationRoute from 'codecrafters-frontend/lib/application-route';
import { inject as service } from '@ember/service';

export default class MembershipRoute extends ApplicationRoute {
  @service store;
  @service router;
  @service('current-user') currentUserService;

  beforeModel() {
    super.beforeModel(...arguments);

    if (this.currentUserService.record.subscriptions.length === 0) {
      this.router.transitionTo('pay');
    }
  }

  afterModel() {
    // Force a sync of subscriptions
    this.store.findAll('subscription');
  }
}
