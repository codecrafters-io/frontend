import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';

export default class ReferRoute extends ApplicationRoute {
  @service('current-user') currentUserService;
  @service store;

  activate() {
    window.scrollTo({ top: 0 });
  }

  async model() {
    if (this.currentUserService.record.hasJoinedReferralProgram) {
      await this.store.query('referral-link', {
        user_id: this.currentUserService.record.id,
        include: 'activations,activations.customer,activations.referrer',
      });
    } else {
      // Referral links themselves are loaded in the serverVariables payload
    }
  }
}
