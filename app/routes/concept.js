import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';

export default class ConceptRoute extends ApplicationRoute {
  allowsAnonymousAccess = true;
  @service store;

  async model(params) {
    const allConcepts = await this.store.findAll('concept', { include: 'questions' });
    const concept = allConcepts.find((concept) => concept.slug === params.concept_slug);

    return {
      concept: concept,
    };
  }
}
