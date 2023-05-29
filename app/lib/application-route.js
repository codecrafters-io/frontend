import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import window from 'ember-window-mock';

export default class ApplicationRoute extends Route {
  allowsAnonymousAccess = false;
  @service currentUser;
  @service router;
  @service utmCampaignIdTracker;

  beforeModel(transition) {
    if (this.currentUser.isAnonymous && !this.allowsAnonymousAccess) {
      if (Object.keys(transition.to.params).length > 0) {
        window.location.href = `/login?next=${encodeURIComponent(this.router.urlFor(transition.to.name, transition.to.params))}`;
      } else {
        window.location.href = `/login?next=${encodeURIComponent(this.router.urlFor(transition.to.name))}`;
      }

      transition.abort();
    }

    if (window.origin.includes('codecrafters.io')) {
      if (window.posthog && this.currentUser.isAuthenticated) {
        window.posthog.identify(this.currentUser.currentUserId, { username: this.currentUser.currentUserUsername });
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
