import type Store from '@ember-data/store';
import type RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import type ContestModel from 'codecrafters-frontend/models/contest';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import RouteInfoMetadata, { RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';
import { hash as RSVPHash } from 'rsvp';

export type ModelType = {
  contests: ContestModel[];
};

export default class ContestsRoute extends BaseRoute {
  @service declare router: RouterService;
  @service declare store: Store;

  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ allowsAnonymousAccess: true, colorScheme: RouteColorScheme.Dark });
  }

  async model(): Promise<ModelType> {
    return RSVPHash({
      contests: this.store.findAll('contest') as unknown as Promise<ContestModel[]>,
    });
  }

  async redirect() {
    // TODO: Redirect to the currently active contest instead of hardcoding weekly-7
    await this.router.transitionTo('contest', 'weekly-7');
  }
}
