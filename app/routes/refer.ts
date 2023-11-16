import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import BaseRoute from 'codecrafters-frontend/lib/base-route';
import scrollToTop from 'codecrafters-frontend/lib/scroll-to-top';
import Store from '@ember-data/store';
import { inject as service } from '@ember/service';

export default class ReferRoute extends BaseRoute {
  @service authenticator!: AuthenticatorService;
  @service store!: Store;

  activate() {
    scrollToTop();
  }

  async model() {
    await this.authenticator.authenticate(); // Force loading referral links

    if (this.authenticator.currentUser?.hasJoinedReferralProgram) {
      await this.store.query('referral-link', {
        user_id: this.authenticator.currentUser.id,
        include: 'activations,activations.customer',
      });

      const freeUsageGrants = await this.store.query('free-usage-grant', {
        user_id: this.authenticator.currentUser.id,
      });

      return { freeUsageGrants };
    } else {
      // Referral links themselves are loaded in the /users/current payload
      return;
    }
  }
}
