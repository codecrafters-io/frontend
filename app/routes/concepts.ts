import type Store from '@ember-data/store';
import { service } from '@ember/service';
import RouteInfoMetadata, { HelpscoutBeaconVisibility, RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import { hash as RSVPHash } from 'rsvp';

export interface ModelType {
  concepts: unknown;
}

export default class ConceptsRoute extends BaseRoute {
  @service declare store: Store;

  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({
      allowsAnonymousAccess: true,
      beaconVisibility: HelpscoutBeaconVisibility.Hidden,
      colorScheme: RouteColorScheme.Both,
    });
  }

  async model(): Promise<ModelType> {
    if (this.authenticator.isAuthenticated) {
      await this.store.findAll('concept-engagement', {
        include: 'concept,user',
      });
    }

    return RSVPHash({
      concepts: this.store.findAll('concept', {
        include: 'author,questions',
      }),
    }) as unknown as Promise<ModelType>;
  }
}
