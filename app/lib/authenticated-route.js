import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import window from 'ember-window-mock';

export default class AuthenticatedRoute extends Route {
  allowsAnonymousAccess = false;
  @service currentUser;
  @service router;

  beforeModel(/* transition */) {
    if (this.currentUser.isAnonymous && !this.allowsAnonymousAccess) {
      window.location.href = `/login?next=${window.location.pathname}`;
    }
  }
}
