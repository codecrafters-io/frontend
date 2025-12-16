import BaseRoute from 'codecrafters-frontend/utils/base-route';
import RouteInfoMetadata, { RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';
import config from 'codecrafters-frontend/config/environment';
import type GiftPaymentFlowModel from 'codecrafters-frontend/models/gift-payment-flow';
import type Store from '@ember-data/store';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type MetaDataService from 'codecrafters-frontend/services/meta-data';
import { inject as service } from '@ember/service';
import scrollToTop from 'codecrafters-frontend/utils/scroll-to-top';

export type ModelType = GiftPaymentFlowModel;

export default class GiftsPayRoute extends BaseRoute {
  @service declare store: Store;
  @service declare authenticator: AuthenticatorService;
  @service declare metaData: MetaDataService;

  previousMetaImageUrl: string | undefined;

  activate() {
    scrollToTop();
  }

  afterModel(): void {
    this.previousMetaImageUrl = this.metaData.imageUrl;
    this.metaData.imageUrl = `${config.x.metaTagImagesBaseURL}gift-card.png`;
  }

  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ allowsAnonymousAccess: true, colorScheme: RouteColorScheme.Both });
  }

  deactivate(): void {
    this.metaData.imageUrl = this.previousMetaImageUrl;
  }

  async model(params: { giftPaymentFlowId?: string }): Promise<ModelType> {
    if (params.giftPaymentFlowId) {
      return await this.store.findRecord('gift-payment-flow', params.giftPaymentFlowId);
    } else {
      // Make sure primaryEmailAddress is loaded for current user
      if (this.authenticator.isAuthenticated) {
        await this.authenticator.authenticate();
      }

      return this.store.createRecord('gift-payment-flow', {
        pricingPlanId: 'v1-lifetime',
        senderEmailAddress: this.authenticator.currentUser?.primaryEmailAddress,
      });
    }
  }
}
