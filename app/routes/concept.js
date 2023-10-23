import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/lib/base-route';

export default class ConceptRoute extends BaseRoute {
  allowsAnonymousAccess = true;
  @service store;

  async model(params) {
    const allConcepts = await this.store.findAll('concept', { include: 'author,questions' });
    const concept = allConcepts.find((concept) => concept.slug === params.concept_slug);

    return {
      concept: concept,
    };
  }
}
