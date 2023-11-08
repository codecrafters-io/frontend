import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/lib/base-route';
import scrollToTop from 'codecrafters-frontend/lib/scroll-to-top';

export default class ReferRoute extends BaseRoute {
  @service authenticator;
  @service store;

  activate() {
    scrollToTop();
  }

  async model() {
    await this.authenticator.authenticate(); // Force loading affiliate links

    if (this.authenticator.currentUser.hasJoinedReferralProgram) {
      await this.store.query('affiliate-link', {
        user_id: this.authenticator.currentUser.id,
        include: 'activations,activations.customer,activations.referrer',
      });
    } else {
      // Affiliate links themselves are loaded in the /users/current payload
    }
  }
}
