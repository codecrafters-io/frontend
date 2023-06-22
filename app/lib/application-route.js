import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import window from 'ember-window-mock';

export default class ApplicationRoute extends Route {
  allowsAnonymousAccess = false;
  @service authenticator;
  @service router;
  @service utmCampaignIdTracker;

  beforeModel(transition) {
    this.authenticator.authenticate();

    if (!this.allowsAnonymousAccess && !this.authenticator.isAuthenticated) {
      if (Object.keys(transition.to.params).length > 0) {
        this.authenticator.initiateLogin(this.router.urlFor(transition.to.name, transition.to.params));
      } else {
        this.authenticator.initiateLogin(this.router.urlFor(transition.to.name));
      }

      transition.abort();
    }

    // TODO: Handle case where `isAuthenticated` isn't present yet
    if (window.origin.includes('codecrafters.io')) {
      if (window.posthog && this.authenticator.currentUserId) {
        window.posthog.identify(this.authenticator.currentUserId, { username: this.authenticator.currentUsername });
      }
    }

    const queryParams = transition.to.queryParams;

    if (queryParams.r && /^\d[a-zA-Z][a-zA-Z]$/.test(queryParams.r)) {
      this.utmCampaignIdTracker.setCampaignId(queryParams.r);
      delete queryParams.r;
      this.router.replaceWith(transition.to.name, { queryParams });
    }
  }
}
