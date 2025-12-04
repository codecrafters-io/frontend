import BaseRoute from 'codecrafters-frontend/utils/base-route';
import type Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';
import MembershipGiftModel from 'codecrafters-frontend/models/membership-gift';
import RouteInfoMetadata, { RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';

export type ModelType = MembershipGiftModel;

export default class GiftsManageRoute extends BaseRoute {
  @service declare store: Store;
  @service declare router: RouterService;

  afterModel(model: ModelType | undefined) {
    if (!model) {
      this.router.transitionTo('not-found');
    }
  }

  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ allowsAnonymousAccess: true, colorScheme: RouteColorScheme.Dark });
  }

  async model(params: { management_token: string }): Promise<ModelType | undefined> {
    const membershipGift = (
      (await this.store.query('membership-gift', { management_token: params.management_token })) as unknown as MembershipGiftModel[]
    )[0];

    return membershipGift;
  }
}
