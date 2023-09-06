import BaseRoute from 'codecrafters-frontend/lib/base-route';
import RouterService from '@ember/routing/router-service';
import Store from '@ember-data/store';
import { inject as service } from '@ember/service';

export default class PerkRoute extends BaseRoute {
  @service declare router: RouterService;
  @service declare store: Store;

  async model () {
    return await this.store.query('perk', {});
  }

  async afterModel() {
    this.router.transitionTo('catalog');
  }
}