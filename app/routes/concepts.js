import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import RouteInfoMetadata, { HelpscoutBeaconVisibility, RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';
import { hash as RSVPHash } from 'rsvp';

export default class ConceptsRoute extends BaseRoute {
  @service store;

  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({
      allowsAnonymousAccess: true,
      beaconVisibility: HelpscoutBeaconVisibility.Hidden,
      colorScheme: RouteColorScheme.Light,
    });
  }

  async model() {
    if (this.authenticator.isAuthenticated) {
      await this.store.findAll('concept-engagement', {
        include: 'concept,user',
      });
    }

    return RSVPHash({
      concepts: this.store.findAll('concept', {
        include: 'author,questions',
      }),
    });
  }
}
