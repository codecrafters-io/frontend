import type RouterService from '@ember/routing/router-service';
import type Transition from '@ember/routing/transition';
import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';

export default class SettingsIndexRoute extends BaseRoute {
  @service declare router: RouterService;

  async beforeModel(transition: Transition) {
    await super.beforeModel(transition);

    this.router.transitionTo('settings.profile');
  }
}
