import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import RouteInfoMetadata, { HelpscoutBeaconVisibility } from 'codecrafters-frontend/utils/route-info-metadata';
import { hash as RSVPHash } from 'rsvp';

export default class ConceptsRoute extends BaseRoute {
  allowsAnonymousAccess = true;
  @service store;

  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ beaconVisibility: HelpscoutBeaconVisibility.Hide });
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
