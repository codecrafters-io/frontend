import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/lib/base-route';
import scrollToTop from 'codecrafters-frontend/lib/scroll-to-top';

export default class PartnerRoute extends BaseRoute {
  @service authenticator;
  @service store;

  activate() {
    scrollToTop();
  }

  async model() {
    await this.authenticator.authenticate(); // Force loading affiliate links

    if (this.authenticator.currentUser.hasJoinedAffiliateProgram) {
      await this.store.query('affiliate-link', {
        user_id: this.authenticator.currentUser.id,
        include: 'referrals,referrals.customer,referrals.referrer',
      });
    } else {
      // Affiliate links themselves are loaded in the /users/current payload
    }
  }
}
