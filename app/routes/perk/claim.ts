import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import BaseRoute from 'codecrafters-frontend/lib/base-route';
import PerkModel from 'codecrafters-frontend/models/perk';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';

export default class PerksClaimRoute extends BaseRoute {
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;

  redirectTo(url: string): void {
    window.location.href = url;
  }

  async model() {
    const perk = this.modelFor('perk') as PerkModel;

    return await perk.claim({}) as unknown as { claim_url: string };
  }

  async afterModel(urlResponse: { claim_url: string }) {
    if (urlResponse.claim_url && (this.authenticator.currentUser.canAccessPaidContent || this.authenticator.currentUser.isStaff)) {
      this.redirectTo(urlResponse.claim_url);
    } else {
      this.router.transitionTo('pay');
    }
  }
}
