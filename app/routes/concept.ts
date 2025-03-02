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
import { tracked } from '@glimmer/tracking';

export class ConceptRouteModel {
  allConcepts: ConceptModel[];
  concept: ConceptModel;
  conceptGroup: ConceptGroupModel;
  @tracked latestConceptEngagement: ConceptEngagementModel;

  constructor({
    allConcepts,
    concept,
    conceptGroup,
    latestConceptEngagement,
  }: {
    allConcepts: ConceptModel[];
    concept: ConceptModel;
    conceptGroup: ConceptGroupModel;
    latestConceptEngagement: ConceptEngagementModel;
  }) {
    this.allConcepts = allConcepts;
    this.concept = concept;
    this.conceptGroup = conceptGroup;
    this.latestConceptEngagement = latestConceptEngagement;
  }
}

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

  afterModel(model: ConceptRouteModel): void {
    if (!model) {
      this.router.transitionTo('not-found');

      return;
    }

    const { concept } = model;

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

  #findCachedOrCreateNewConceptEngagement(concept: ConceptModel) {
    const cachedEngagement = this.store
      .peekAll('concept-engagement')
      .filter((engagement) => {
        return engagement.concept.slug === concept.slug && engagement.user === this.authenticator.currentUser;
      })
      .sortBy('createdAt')
      .reverse()[0];

    return (
      cachedEngagement ||
      this.store.createRecord('concept-engagement', {
        concept,
        user: this.authenticator.currentUser,
        currentProgressPercentage: 0,
      })
    );
  }

  async model(params: { concept_slug: string }) {
    // First, try finding the concept already cached in the store
    let allConcepts = await this.store.findAll('concept', { include: 'author,questions' });
    let concept = allConcepts.find((concept) => concept.slug === params.concept_slug);

    if (!concept) {
      // If no concept found, re-fetch concepts and try again
      allConcepts = await this.store.findAll('concept', { include: 'author,questions', reload: true });
      concept = allConcepts.find((concept) => concept.slug === params.concept_slug);

      if (!concept) {
        return; // will redirect to 404 in afterModel
      }
    }

    const allConceptGroups = await this.store.findAll('concept-group');
    const relatedConceptGroups = allConceptGroups
      .filter((group) => group.conceptSlugs.includes(concept.slug))
      .sort((a, b) => a.slug.localeCompare(b.slug));

    const latestConceptEngagement = this.#findCachedOrCreateNewConceptEngagement(concept);

    if (this.authenticator.isAuthenticated) {
      this.#updateConceptEngagements(concept);
    }

    return new ConceptRouteModel({
      allConcepts: allConcepts as unknown as ConceptModel[],
      concept,
      conceptGroup: relatedConceptGroups[0],
      latestConceptEngagement,
    });
  }

  async #updateConceptEngagements(concept: ConceptModel) {
    await this.store.findAll('concept-engagement', {
      include: 'concept,user',
      reload: true,
    });

    const model = this.controller.model as ConceptRouteModel;
    model.latestConceptEngagement = this.#findCachedOrCreateNewConceptEngagement(concept);
  }
}
