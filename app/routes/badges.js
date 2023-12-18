import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import RSVP from 'rsvp';

export default class BadgesRoute extends BaseRoute {
  allowsAnonymousAccess = true;
  @service authenticator;
  @service store;

  async model() {
    return RSVP.hash({
      badges: this.store.findAll('badge', {
        include: 'current-user-awards,current-user-awards.user,current-user-awards.badge',
      }),
    });
  }
}
