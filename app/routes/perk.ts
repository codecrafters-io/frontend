import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/lib/base-route';
import Store from '@ember-data/store';

export default class PerkRoute extends BaseRoute {
  @service declare store: Store;

  async model () {
    return await this.store.query('perk', {})
  }
}