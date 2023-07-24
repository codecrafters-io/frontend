import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import window from 'ember-window-mock';
import RouterService from '@ember/routing/router-service';
type Transition = ReturnType<RouterService['transitionTo']>;

export default class BaseRoute extends Route {
  allowsAnonymousAccess = false;
  @service authenticator: unknown;
  @service declare router: RouterService;
  @service utmCampaignIdTracker: unknown;

  beforeModel(transition: Transition) {
    // @ts-ignore
    this.authenticator.authenticate();

    // @ts-ignore
    if (!this.allowsAnonymousAccess && !this.authenticator.isAuthenticated) {
      if (Object.keys(transition.to.params).length > 0) {
        // @ts-ignore
        this.authenticator.initiateLogin(this.router.urlFor(transition.to.name, transition.to.params));
      } else {
        // @ts-ignore
        this.authenticator.initiateLogin(this.router.urlFor(transition.to.name));
      }

      transition.abort();
    }

    // TODO: Handle case where `isAuthenticated` isn't present yet
    if (window.origin.includes('codecrafters.io')) {
      // @ts-ignore
      if (window.posthog && this.authenticator.currentUserId) {
        // @ts-ignore
        window.posthog.identify(this.authenticator.currentUserId, { username: this.authenticator.currentUsername });
      }
    }

    const queryParams = transition.to.queryParams;

    if (queryParams['r'] && /^\d[a-zA-Z][a-zA-Z]$/.test(queryParams['r'])) {
      // @ts-ignore
      this.utmCampaignIdTracker.setCampaignId(queryParams['r']);
      delete queryParams['r'];
      this.router.replaceWith(transition.to.name, { queryParams });
    }
  }
}
