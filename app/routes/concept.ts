import BaseRoute from 'codecrafters-frontend/utils/base-route';
import scrollToTop from 'codecrafters-frontend/utils/scroll-to-top';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import ConceptModel from 'codecrafters-frontend/models/concept';
import ConceptGroupModel from 'codecrafters-frontend/models/concept-group';
import ConceptEngagementModel from 'codecrafters-frontend/models/concept-engagement';
import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import RouterService from '@ember/routing/router-service';
import Store from '@ember-data/store';

export type ConceptRouteModel = {
  allConcepts: ConceptModel[];
  concept: ConceptModel;
  conceptGroup: ConceptGroupModel;
  latestConceptEngagement: ConceptEngagementModel;
};

export default class ConceptRoute extends BaseRoute {
  allowsAnonymousAccess = true;
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;
  @service declare store: Store;

  constructor(...args: object[]) {
    super(...args);

    this.router.on('routeDidChange', () => {
      scheduleOnce('afterRender', this, scrollToTop);
    });
  }

  async findOrCreateConceptEngagement(concept: ConceptModel) {
    const latestConceptEngagement = this.authenticator.currentUser?.conceptEngagements
      .filter((engagement) => engagement.concept.slug === concept.slug)
      .sortBy('createdAt')
      .reverse()[0];

    if (!latestConceptEngagement) {
      return await this.store.createRecord('concept-engagement', {
        concept,
        user: this.authenticator.currentUser,
      });
    }

    return latestConceptEngagement;
  }

  async model(params: { concept_slug: string }) {
    const allConcepts = await this.store.findAll('concept', { include: 'author,questions' });
    const concept = allConcepts.find((concept) => concept.slug === params.concept_slug);

    if (!concept) {
      this.router.transitionTo('not-found');

      return;
    }

    const allConceptGroups = await this.store.findAll('concept-group');
    const relatedConceptGroups = allConceptGroups
      .filter((group) => group.conceptSlugs.includes(concept.slug))
      .sort((a, b) => a.slug.localeCompare(b.slug));

    if (this.authenticator.isAuthenticated) {
      await this.store.findAll('concept-engagement', {
        include: 'concept,user',
      });
    }

    const latestConceptEngagement = await this.findOrCreateConceptEngagement(concept);

    return {
      allConcepts,
      concept,
      conceptGroup: relatedConceptGroups[0],
      latestConceptEngagement,
    };
  }
}
