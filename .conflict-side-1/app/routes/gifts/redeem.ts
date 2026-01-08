import BaseRoute from 'codecrafters-frontend/utils/base-route';
import config from 'codecrafters-frontend/config/environment';
import type Store from '@ember-data/store';
import { service } from '@ember/service';
import RouterService from '@ember/routing/router-service';
import MembershipGiftModel from 'codecrafters-frontend/models/membership-gift';
import RouteInfoMetadata, { RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';
import type MetaDataService from 'codecrafters-frontend/services/meta-data';

export type ModelType = MembershipGiftModel;

export default class GiftsRedeemRoute extends BaseRoute {
  @service declare store: Store;
  @service declare router: RouterService;
  @service declare metaData: MetaDataService;

  previousMetaImageUrl: string | undefined;

  afterModel(model: ModelType | undefined) {
    if (!model) {
      this.router.transitionTo('not-found');

      return;
    }

    if (model.redeemedAt) {
      this.router.transitionTo('gifts.redeemed');

      return;
    }

    this.previousMetaImageUrl = this.metaData.imageUrl;
    this.metaData.imageUrl = `${config.x.metaTagImagesBaseURL}gift-card.png`;
  }

  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ allowsAnonymousAccess: true, colorScheme: RouteColorScheme.Dark });
  }

  deactivate(): void {
    this.metaData.imageUrl = this.previousMetaImageUrl;
  }

  async model(params: { secret_token: string }): Promise<ModelType | undefined> {
    const membershipGift = (
      (await this.store.query('membership-gift', { secret_token: params.secret_token })) as unknown as MembershipGiftModel[]
    )[0];

    return membershipGift;
  }
}
