import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import window from 'ember-window-mock';

export default class AuthenticatedRoute extends Route {
  allowsAnonymousAccess = false;
  @service currentUser;
  @service router;

  beforeModel(transition) {
    this.currentUser.authenticate();

    if (this.currentUser.isAnonymous && !this.allowsAnonymousAccess) {
      window.location.href = `/login?next=${this.router.urlFor(transition.to.name, transition.to.params)}`;
      transition.abort();
    }
  }
}
