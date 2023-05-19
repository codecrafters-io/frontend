import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';
import RSVP from 'rsvp';

export default class BadgesRoute extends ApplicationRoute {
  allowsAnonymousAccess = true;
  @service currentUser;
  @service store;

  async model() {
    return RSVP.hash({
      badges: this.store.findAll('badge', {
        include: 'current-user-awards,current-user-awards.user,current-user-awards.badge',
      }),
    });
  }
}
