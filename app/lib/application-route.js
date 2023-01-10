import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import window from 'ember-window-mock';

export default class ApplicationRoute extends Route {
  allowsAnonymousAccess = false;
  @service currentUser;
  @service router;

  beforeModel(transition) {
    this.currentUser.authenticate();

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
  }
}
