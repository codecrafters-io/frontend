import { service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import RouteInfoMetadata, { HelpscoutBeaconVisibility, RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';
import { hash as RSVPHash } from 'rsvp';
import type Store from '@ember-data/store';

export default class ConceptsRoute extends BaseRoute {
  @service declare store: Store;

  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({
      allowsAnonymousAccess: true,
      beaconVisibility: HelpscoutBeaconVisibility.Hidden,
      colorScheme: RouteColorScheme.Both,
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
