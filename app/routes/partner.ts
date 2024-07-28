import type Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import scrollToTop from 'codecrafters-frontend/utils/scroll-to-top';

export default class PartnerRoute extends BaseRoute {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  activate() {
    scrollToTop();
  }

  async model() {
    await this.authenticator.authenticate(); // Force loading affiliate links

    if (this.authenticator.currentUser!.hasJoinedAffiliateProgram) {
      await this.store.query('affiliate-link', {
        user_id: this.authenticator.currentUser!.id,
        include: 'referrals,referrals.customer,referrals.referrer',
      });
    } else {
      // Affiliate links themselves are loaded in the /users/current payload
    }
  }
}
