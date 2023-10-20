import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/lib/base-route';
import RSVP from 'rsvp';

export default class ConceptsRoute extends BaseRoute {
  allowsAnonymousAccess = true;
  @service store;

  async model() {
    return RSVP.hash({
      concepts: this.store.findAll('concept', {
        include: 'author,questions',
      }),
    });
  }
}
