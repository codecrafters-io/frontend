import AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import BaseRoute from 'codecrafters-frontend/lib/base-route';
import RouterService from '@ember/routing/router-service';
import Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import PerkModel from 'codecrafters-frontend/models/perk';

export default class PerksClaimRoute extends BaseRoute {
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;
  @service declare store: Store;

  redirectTo(url: string): void {
    window.location.href = url;
  }

  async model() {
    const perk = this.modelFor('perk') as PerkModel;
    this.analyticsEventTracker.track('claimed_perk', { perk_id: perk.id });

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
