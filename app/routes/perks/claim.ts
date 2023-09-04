import BaseRoute from 'codecrafters-frontend/lib/base-route';
import PerkModel from 'codecrafters-frontend/models/perk';
import Store from '@ember-data/store';
import { inject as service } from '@ember/service';

export default class PerksClaimRoute extends BaseRoute {
  @service declare store: Store;

  async model(params: { slug: string }) {
    const perk = await this.store.findRecord('perk', params.slug);
    return perk;
  }

  afterModel(perk: PerkModel) {
    window.location.href = perk.claimUrl;
  }
}
