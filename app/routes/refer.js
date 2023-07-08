import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';
import scrollToTop from 'codecrafters-frontend/lib/scroll-to-top';

export default class ReferRoute extends ApplicationRoute {
  @service authenticator;
  @service store;

  activate() {
    scrollToTop();
  }

  async model() {
    await this.authenticator.authenticate(); // Force loading referral links

    if (this.authenticator.currentUser.hasJoinedReferralProgram) {
      await this.store.query('referral-link', {
        user_id: this.authenticator.currentUser.id,
        include: 'activations,activations.customer,activations.referrer',
      });
    } else {
      // Referral links themselves are loaded in the /users/current payload
    }
  }
}
