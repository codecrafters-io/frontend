import BaseRoute from 'codecrafters-frontend/utils/base-route';
import scrollToTop from 'codecrafters-frontend/utils/scroll-to-top';
import { service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import ConceptModel from 'codecrafters-frontend/models/concept';
import ConceptGroupModel from 'codecrafters-frontend/models/concept-group';
import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type MetaDataService from 'codecrafters-frontend/services/meta-data';
import RouterService from '@ember/routing/router-service';
import Store from '@ember-data/store';
import RouteInfoMetadata, { HelpscoutBeaconVisibility, RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';
import type Transition from '@ember/routing/transition';
import type ConceptController from 'codecrafters-frontend/controllers/concept';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';

export type ConceptRouteModel = {
  allConcepts: ConceptModel[];
  concept: ConceptModel;
  conceptGroup: ConceptGroupModel;
};

export default class ConceptRoute extends BaseRoute {
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
    return new RouteInfoMetadata({
      allowsAnonymousAccess: true,
      beaconVisibility: HelpscoutBeaconVisibility.Hidden,
      colorScheme: RouteColorScheme.Both,
    });
  }

  deactivate() {
    this.metaData.imageUrl = this.previousMetaImageUrl;
    this.metaData.title = this.previousMetaTitle;
    this.metaData.description = this.previousMetaDescription;
  }

  async model(params: { concept_slug: string }) {
    // First, try finding the concept already cached in the store
    let allConcepts = await this.store.findAll('concept', { include: 'author,questions' });
    let concept = allConcepts.find((concept) => concept.slug === params.concept_slug);

    if (!concept) {
      // If no concept found, re-fetch concepts and try again
      allConcepts = await this.store.findAll('concept', { include: 'author,questions', reload: true });
      concept = allConcepts.find((concept) => concept.slug === params.concept_slug);

      // If still no concept found, return undefined
      if (!concept) {
        return; // will redirect to 404 in afterModel
      }
    }

    const allConceptGroups = await this.store.findAll('concept-group');
    const relatedConceptGroups = allConceptGroups
      .filter((group) => group.conceptSlugs.includes(concept.slug))
      .sort((a, b) => a.slug.localeCompare(b.slug));

    return {
      allConcepts,
      concept,
      conceptGroup: relatedConceptGroups[0],
    };
  }

  #peekCachedOrCreateNewConceptEngagement(concept: ConceptModel) {
    const user = this.authenticator.currentUser;
    const cachedEngagement = this.store
      .peekAll('concept-engagement')
      .filter((e) => e.concept.slug === concept.slug && e.user === user)
      .sort(fieldComparator('createdAt'))
      .reverse()[0];

    return (
      cachedEngagement ||
      this.store.createRecord('concept-engagement', {
        concept,
        user,
        currentProgressPercentage: 0,
      })
    );
  }

  setupController(controller: ConceptController, model: ConceptRouteModel, transition: Transition): void {
    super.setupController(controller, model, transition);

    // First, use an existing concept engagement (or create a new one)
    controller.latestConceptEngagement = this.#peekCachedOrCreateNewConceptEngagement(model.concept);

    if (this.authenticator.isAuthenticated) {
      // If the user is authenticated — fetch his real engagements...
      this.store
        .findAll('concept-engagement', {
          include: 'concept,user',
          reload: true, // force reloading from the back-end
        })
        .then(() => {
          // ... and then update the controller with the real engagement (or create a new one, if still none found)
          controller.latestConceptEngagement = this.#peekCachedOrCreateNewConceptEngagement(model.concept);
        });
    }
  }
}
