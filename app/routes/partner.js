import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/lib/base-route';
import scrollToTop from 'codecrafters-frontend/lib/scroll-to-top';
import window from 'ember-window-mock';

export default class PartnerRoute extends BaseRoute {
  @service authenticator;
  @service store;

  activate() {
    scrollToTop();
  }

  async beforeModel() {
    await this.authenticator.authenticate();
    const currentUser = this.authenticator.currentUser;

    if (!currentUser.isAffiliate) {
      window.location = 'https://docs.codecrafters.io/community/partner-program';
    }
  }

  async model() {
    await this.authenticator.authenticate(); // Force loading affiliate links

    if (this.authenticator.currentUser.hasJoinedReferralProgram) {
      await this.store.query('affiliate-link', {
        user_id: this.authenticator.currentUser.id,
        include: 'referrals,referrals.customer,referrals.referrer',
      });
    } else {
      // Affiliate links themselves are loaded in the /users/current payload
    }
  }
}
