import BaseRoute from 'codecrafters-frontend/utils/base-route';
import scrollToTop from 'codecrafters-frontend/utils/scroll-to-top';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';

export default class ConceptRoute extends BaseRoute {
  allowsAnonymousAccess = true;
  @service authenticator;
  @service router;
  @service store;

  constructor() {
    super(...arguments);

    this.router.on('routeDidChange', () => {
      scheduleOnce('afterRender', this, scrollToTop);
    });
  }

  async findOrCreateConceptEngagement(concept) {
    const latestConceptEngagement = this.authenticator.currentUser?.conceptEngagements
      .filter((engagement) => engagement.concept.slug === concept.slug)
      .sortBy('createdAt')
      .reverse()[0];

    if (!latestConceptEngagement) {
      return await this.store
        .createRecord('concept-engagement', {
          concept,
          user: this.authenticator.currentUser,
        })
    }

    return latestConceptEngagement;
  }

  async model(params) {
    const allConcepts = await this.store.findAll('concept', { include: 'author,questions' });
    const concept = allConcepts.find((concept) => concept.slug === params.concept_slug);

    const allConceptGroups = await this.store.findAll('concept-group');
    const relatedConceptGroups = allConceptGroups
      .filter((group) => group.conceptSlugs.includes(concept.slug))
      .sort((a, b) => a.slug.localeCompare(b.slug));

    if (this.authenticator.isAuthenticated) {
      await this.store.findAll('concept-engagement', {
        include: 'concept,user',
      });
    }

    let latestConceptEngagement;

    if (this.authenticator.isAuthenticated) {
      latestConceptEngagement = await this.findOrCreateConceptEngagement(concept);
    }

    return {
      allConcepts,
      concept,
      conceptGroup: relatedConceptGroups[0],
      latestConceptEngagement,
    };
  }
}
