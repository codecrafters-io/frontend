import BaseRoute from 'codecrafters-frontend/utils/base-route';
import scrollToTop from 'codecrafters-frontend/utils/scroll-to-top';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import ConceptModel from 'codecrafters-frontend/models/concept';
import ConceptGroupModel from 'codecrafters-frontend/models/concept-group';
import ConceptEngagementModel from 'codecrafters-frontend/models/concept-engagement';
import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type MetaDataService from 'codecrafters-frontend/services/meta-data';
import RouterService from '@ember/routing/router-service';
import Store from '@ember-data/store';
import RouteInfoMetadata, { HelpscoutBeaconVisibility } from 'codecrafters-frontend/utils/route-info-metadata';

export type ConceptRouteModel = {
  allConcepts: ConceptModel[];
  concept: ConceptModel;
  conceptGroup: ConceptGroupModel;
  latestConceptEngagement: ConceptEngagementModel;
};

export default class ConceptRoute extends BaseRoute {
  allowsAnonymousAccess = true;
  @service declare authenticator: AuthenticatorService;
  @service declare metaData: MetaDataService;
  @service declare router: RouterService;
  @service declare store: Store;

  previousMetaImageUrl: string | undefined;
  previousMetaTitle: string | undefined;
  previousMetaDescription: string | undefined;

  constructor(...args: object[]) {
    super(...args);

    this.router.on('routeDidChange', () => {
      scheduleOnce('afterRender', this, scrollToTop);
    });
  }

  afterModel({ concept }: ConceptRouteModel): void {
    // Save previous OG meta tags
    this.previousMetaImageUrl = this.metaData.imageUrl;
    this.previousMetaTitle = this.metaData.title;
    this.previousMetaDescription = this.metaData.description;

    // Override OG meta tags with concept-specific ones
    this.metaData.imageUrl = `https://og.codecrafters.io/api/concept/${concept.slug}`;
    this.metaData.title =
      concept.title ||
      concept.slug // Fallback to converting the slug to title: network-protocols > Network Protocols
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    this.metaData.description = concept.descriptionMarkdown || `View the ${this.metaData.title} concept on CodeCrafters`;
  }

  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ beaconVisibility: HelpscoutBeaconVisibility.Hidden });
  }

  deactivate() {
    this.metaData.imageUrl = this.previousMetaImageUrl;
    this.metaData.title = this.previousMetaTitle;
    this.metaData.description = this.previousMetaDescription;
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
        currentProgressPercentage: 0,
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
