import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import RSVP from 'rsvp';

export default class ConceptsRoute extends BaseRoute {
  allowsAnonymousAccess = true;
  @service store;

  async model() {
    if (this.authenticator.isAuthenticated) {
      await this.store.findAll('concept-engagement', {
        include: 'concept,user',
      });
    }

    return RSVP.hash({
      concepts: this.store.findAll('concept', {
        include: 'author,questions',
      }),
    });
  }
}
