import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import ConceptModel from 'codecrafters-frontend/models/concept';
import ConceptGroupModel from 'codecrafters-frontend/models/concept-group';
import config from 'codecrafters-frontend/config/environment';
import HeadDataService from 'codecrafters-frontend/services/meta-data';
import Store from '@ember-data/store';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ConceptGroupRoute extends BaseRoute {
  allowsAnonymousAccess = true;

  @service declare authenticator: AuthenticatorService
  @service declare metaData: HeadDataService;
  @service declare store: Store;
  @service declare router: RouterService;
  @tracked previousMetaImageUrl: string | undefined = undefined;

  async afterModel(model: { conceptGroup: ConceptGroupModel }) {
    this.previousMetaImageUrl = this.metaData.imageUrl;
    // @ts-ignore
    this.metaData.imageUrl = `${config.x.metaTagImagesBaseURL}collection-${model.conceptGroup.slug}.png`;
  }

  deactivate() {
    this.metaData.imageUrl = this.previousMetaImageUrl;
  }

  async model(params: { concept_group_slug: string }) {
    const conceptGroup = await this.store.queryRecord('concept-group', { slug: params.concept_group_slug, include: 'author' });

    if (!conceptGroup) {
      console.error(`Unable to find concept-group "${params.concept_group_slug}", redirecting to /`);
      this.router.transitionTo('/');
    }

    const allConcepts = await this.store.findAll('concept', { include: 'author,questions' });

    const concepts = conceptGroup.conceptSlugs.reduce((acc: Array<ConceptModel>, slug: string) => {
      const concept = allConcepts.find((concept) => concept.slug === slug);

      if (concept) {
        acc.push(concept);
      }

      return acc;
    }, []);

    if (this.authenticator.isAuthenticated) {
      await this.store.findAll('concept-engagement', {
        include: 'concept,user',
      });
    }

    return {
      conceptGroup,
      concepts,
    };
  }
}
