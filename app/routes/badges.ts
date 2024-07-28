import type Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import type BadgeModel from 'codecrafters-frontend/models/badge';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import RouteInfoMetadata, { RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';
import { hash as RSVPHash } from 'rsvp';

export type ModelType = {
  badges: BadgeModel[];
};

export default class BadgesRoute extends BaseRoute {
  allowsAnonymousAccess = true;

  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ colorScheme: RouteColorScheme.Dark });
  }

  async model(): Promise<ModelType> {
    return RSVPHash({
      badges: this.store.findAll('badge', {
        include: 'current-user-awards,current-user-awards.user,current-user-awards.badge',
      }) as unknown as BadgeModel[],
    });
  }
}
