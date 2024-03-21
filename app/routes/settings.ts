import type RouterService from '@ember/routing/router-service';
import type Transition from '@ember/routing/transition';
import { inject as service } from '@ember/service';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import BaseRoute from 'codecrafters-frontend/utils/base-route';

export default class SettingsRoute extends BaseRoute {
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;

  async beforeModel(transition: Transition) {
    await super.beforeModel(transition);

    await this.authenticator.authenticate();

    if (!this.authenticator.currentUser!.isStaff) {
      this.router.transitionTo('catalog'); // Temporarily only expose for staff users
    }
  }
}
