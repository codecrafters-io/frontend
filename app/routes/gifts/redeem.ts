import Route from '@ember/routing/route';
import type Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';
import MembershipGiftModel from 'codecrafters-frontend/models/membership-gift';

export type ModelType = MembershipGiftModel;

export default class GiftsRedeemRoute extends Route {
  @service declare store: Store;
  @service declare router: RouterService;

  afterModel(model: ModelType | undefined) {
    if (!model) {
      this.router.transitionTo('not-found');
    }
  }

  async model(params: { secret_token: string }): Promise<ModelType | undefined> {
    const membershipGift = (
      (await this.store.query('membership-gift', { secret_token: params.secret_token })) as unknown as MembershipGiftModel[]
    )[0];

    return membershipGift;
  }
}
