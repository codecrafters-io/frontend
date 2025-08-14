import BaseRoute from 'codecrafters-frontend/utils/base-route';
import { inject as service } from '@ember/service';
import InstitutionModel from 'codecrafters-frontend/models/institution';
import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Store from '@ember-data/store';
import RouteInfoMetadata from 'codecrafters-frontend/utils/route-info-metadata';
import type MetaDataService from 'codecrafters-frontend/services/meta-data';
import config from 'codecrafters-frontend/config/environment';

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

    this.metaData.imageUrl = `${config.x.metaTagImagesBaseURL}institution-${model.institution.slug}.jpg`;
  }

  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ allowsAnonymousAccess: true });
  }

  async model(params: { institution_slug: string }) {
    const allInstitutions = await this.store.findAll('institution');
    const institution = allInstitutions.find((institution) => institution.slug.toLowerCase() === params.institution_slug.toLowerCase());

    if (!institution) {
      return; // will redirect to 404 in afterModel
    }

    if (this.authenticator.isAuthenticated) {
      await this.store.findAll('institution-membership-grant-application', { include: 'institution,user' });
    }

    return {
      institution,
    };
  }
}
