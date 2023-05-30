import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';
import RSVP from 'rsvp';

export default class ConceptsRoute extends ApplicationRoute {
  allowsAnonymousAccess = true;
  @service store;

  async model() {
    return RSVP.hash({
      concepts: this.store.findAll('concept', {
        include: 'questions',
      }),
    });
  }
}
