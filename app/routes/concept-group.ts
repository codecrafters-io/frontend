import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/lib/base-route';
import Store from '@ember-data/store';

export default class ConceptGroupRoute extends BaseRoute {
  allowsAnonymousAccess = true;

  @service store!: Store;

  async model(params: { concept_group_slug: string }) {
    const conceptGroup = await this.store.findRecord('concept-group', params.concept_group_slug, { include: 'author' });
    const allConcepts = await this.store.findAll('concept', { include: 'author,questions' });
    const concepts = conceptGroup.conceptSlugs.map((slug: string) => allConcepts.find((concept) => concept.slug === slug));

    return {
      conceptGroup,
      concepts,
    };
  }
}
