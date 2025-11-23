import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import ConceptGroupModel from 'codecrafters-frontend/models/concept-group';
import config from 'codecrafters-frontend/config/environment';
import HeadDataService from 'codecrafters-frontend/services/meta-data';
import Store from '@ember-data/store';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import RouteInfoMetadata, { RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';

export default class ConceptGroupRoute extends BaseRoute {
  @service declare authenticator: AuthenticatorService;
  @service declare metaData: HeadDataService;
  @service declare store: Store;
  @service declare router: RouterService;

  previousMetaImageUrl: string | undefined = undefined;

  afterModel(model: { conceptGroup: ConceptGroupModel }) {
    this.previousMetaImageUrl = this.metaData.imageUrl;
    this.metaData.imageUrl = `${config.x.metaTagImagesBaseURL}collection-${model.conceptGroup.slug}.png`;
  }

  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ allowsAnonymousAccess: true, colorScheme: RouteColorScheme.Light });
  }

  deactivate() {
    this.metaData.imageUrl = this.previousMetaImageUrl;
  }

  async model(params: { concept_group_slug: string }) {
    const conceptGroup = await this.store.queryRecord('concept-group', {
      slug: params.concept_group_slug,
      include: 'author,concepts,concepts.author',
    });

    if (!conceptGroup) {
      this.router.transitionTo('/');
    }

    if (this.authenticator.isAuthenticated) {
      await this.store.findAll('concept-engagement', { include: 'concept,user' });
    }

    return { conceptGroup };
  }
}
