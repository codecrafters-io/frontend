import BaseRoute from 'codecrafters-frontend/utils/base-route';
import config from 'codecrafters-frontend/config/environment';
import type Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';
import MembershipGiftModel from 'codecrafters-frontend/models/membership-gift';
import RouteInfoMetadata, { RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';
import type MetaDataService from 'codecrafters-frontend/services/meta-data';

export type ModelType = {
  gift: MembershipGiftModel;
  managementToken: string;
};

export default class GiftsManageRoute extends BaseRoute {
  @service declare store: Store;
  @service declare router: RouterService;
  @service declare metaData: MetaDataService;

  previousMetaImageUrl: string | undefined;

  afterModel(model: ModelType | undefined) {
    if (!model?.gift) {
      this.router.transitionTo('not-found');

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

  async model(params: { management_token: string }): Promise<ModelType | undefined> {
    const membershipGift = (
      (await this.store.query('membership-gift', { management_token: params.management_token })) as unknown as MembershipGiftModel[]
    )[0];

    if (!membershipGift) {
      return undefined;
    }

    return {
      gift: membershipGift,
      managementToken: params.management_token,
    };
  }
}
