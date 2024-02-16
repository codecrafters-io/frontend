import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import PerkModel from 'codecrafters-frontend/models/perk';
import RouterService from '@ember/routing/router-service';
import Store from '@ember-data/store';
import { inject as service } from '@ember/service';

export default class PerkRoute extends BaseRoute {
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;
  @service declare store: Store;

  afterModel(model: PerkModel) {
    if (!model) {
      this.router.transitionTo('not-found');
    }
  }

  async model(params: { slug: string }) {
    const perk = await this.store.query('perk', { slug: params.slug });

    return perk.objectAt(0);
  }
}
