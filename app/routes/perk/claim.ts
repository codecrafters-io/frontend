import BaseRoute from 'codecrafters-frontend/lib/base-route';
import Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import JSONAPIAdapter from '@ember-data/adapter/json-api';

export default class PerksClaimRoute extends BaseRoute {
  @service declare store: Store;

  async model(params: { slug: string }) {
    const adapter = this.store.adapterFor('application' as never) as JSONAPIAdapter;
    const url = adapter.buildURL() + `/perks/${params.slug}/claim`;
    const perk = await adapter.ajax(url, 'GET');

    console.log(perk);
    return perk;
  }
}
