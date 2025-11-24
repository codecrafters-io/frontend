import type Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import config from 'codecrafters-frontend/config/environment';
import type InstitutionModel from 'codecrafters-frontend/models/institution';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type MetaDataService from 'codecrafters-frontend/services/meta-data';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import RouteInfoMetadata, { RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';

export type InstitutionRouteModel = {
  institution: InstitutionModel;
};

export default class InstitutionRoute extends BaseRoute {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;
  @service declare metaData: MetaDataService;

  afterModel(model: InstitutionRouteModel): void {
    if (!model) {
      this.router.transitionTo('not-found');

      return;
    }

    this.metaData.imageUrl = `${config.x.metaTagImagesBaseURL}institution-${model.institution.slug}.png`;
  }

  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ allowsAnonymousAccess: true, colorScheme: RouteColorScheme.Both });
  }

  async model(params: { institution_slug: string }) {
    const allInstitutions = await this.store.findAll('institution');
    const institution = allInstitutions.find((institution) => institution.slug.toLowerCase() === params.institution_slug.toLowerCase());

    if (!institution) {
      return; // will redirect to 404 in afterModel
    }

    if (this.authenticator.isAuthenticated) {
      await this.store.findAll('institution-membership-grant-application', { include: 'institution,user' });
      await this.store.findAll('email-address', { include: 'user' });
    }

    return {
      institution,
    };
  }
}
