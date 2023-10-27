import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/lib/base-route';
import ConceptModel from 'codecrafters-frontend/models/concept';
import Store from '@ember-data/store';

export default class ConceptGroupRoute extends BaseRoute {
  allowsAnonymousAccess = true;

  @service store!: Store;

  async model(params: { concept_group_slug: string }) {
    const conceptGroup = await this.store.findRecord('concept-group', params.concept_group_slug, { include: 'author' });
    const allConcepts = await this.store.findAll('concept', { include: 'author,questions' });

    const concepts = conceptGroup.conceptSlugs.reduce((acc: Array<ConceptModel>, slug: string) => {
      const concept = allConcepts.find((concept) => concept.slug === slug);

      if (concept) {
        acc.push(concept);
      }

      return acc;
    }, []);

    return {
      conceptGroup,
      concepts,
    };
  }
}
