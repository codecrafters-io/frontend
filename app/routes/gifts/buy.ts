import BaseRoute from 'codecrafters-frontend/utils/base-route';
import RouteInfoMetadata, { RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';
import type GiftPaymentFlowModel from 'codecrafters-frontend/models/gift-payment-flow';
import type Store from '@ember-data/store';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import { inject as service } from '@ember/service';

export type ModelType = GiftPaymentFlowModel;

export default class GiftsPayRoute extends BaseRoute {
  @service declare store: Store;
  @service declare authenticator: AuthenticatorService;

  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ allowsAnonymousAccess: true, colorScheme: RouteColorScheme.Both });
  }

  async model(params: { giftPaymentFlowId?: string }): Promise<ModelType> {
    if (params.giftPaymentFlowId) {
      return await this.store.findRecord('gift-payment-flow', params.giftPaymentFlowId);
    } else {
      return this.store.createRecord('gift-payment-flow', {
        pricingPlanId: 'v1-lifetime',
        senderEmailAddress: this.authenticator.currentUser?.primaryEmailAddress,
      });
    }
  }
}
