import BaseRoute from 'codecrafters-frontend/lib/base-route';
import JSONAPIAdapter from '@ember-data/adapter/json-api';
import JSONAPISerializer from '@ember-data/serializer/json-api';
import PerkModel from 'codecrafters-frontend/models/perk';
import Store from '@ember-data/store';
import { inject as service } from '@ember/service';

export default class PerksClaimRoute extends BaseRoute {
  @service declare store: Store;

  async model(params: { slug: string }): Promise<PerkModel> {
    const adapter = this.store.adapterFor('application' as never) as JSONAPIAdapter;
    const url = adapter.buildURL() + `/perks/${params.slug}/claim`;
    const rawResponse = await adapter.ajax(url, 'GET');
    const serializer = this.store.serializerFor('application' as never) as JSONAPISerializer;
    const normalizedResponse = serializer.normalizeResponse(this.store, this.store.modelFor('perk'), rawResponse, rawResponse["data"]["id"], 'findRecord') as { data: { attributes: PerkModel } };

    return normalizedResponse.data.attributes;
  }

  async afterModel(perk: PerkModel): Promise<void> {
    if (perk.claimUrl) {
      window.location.href = perk.claimUrl;
    }
  }
}
