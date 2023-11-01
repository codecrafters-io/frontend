import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/lib/base-route';

export default class ConceptRoute extends BaseRoute {
  allowsAnonymousAccess = true;
  @service store;

  async model(params) {
    const allConcepts = await this.store.findAll('concept', { include: 'author,questions' });
    const concept = allConcepts.find((concept) => concept.slug === params.concept_slug);

    const allConceptGroups = await this.store.findAll('concept-group');
    const relatedConceptGroups = allConceptGroups
      .filter((group) => group.conceptSlugs.includes(concept.slug))
      .sort((a, b) => a.slug.localeCompare(b.slug));

    let nextConcept = null;

    if (relatedConceptGroups[0]) {
      const currentConceptIndex = relatedConceptGroups[0].conceptSlugs.indexOf(concept.slug);
      const nextConceptSlug = relatedConceptGroups[0].conceptSlugs[currentConceptIndex + 1];

      if (nextConceptSlug) {
        nextConcept = allConcepts.find((concept) => concept.slug === nextConceptSlug);
      }
    }

    return {
      concept,
      conceptGroup: relatedConceptGroups[0],
      nextConcept,
    };
  }
}
