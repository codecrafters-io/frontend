import BaseRoute from 'codecrafters-frontend/utils/base-route';
import { service } from '@ember/service';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type Transition from '@ember/routing/transition';

export default class LoginRoute extends BaseRoute {
  @service declare authenticator: AuthenticatorService;

  beforeModel(transition: Transition) {
    if (transition.to?.queryParams['next']) {
      this.authenticator.initiateLoginAndRedirectTo(transition.to.queryParams['next'] as string);
    } else {
      this.authenticator.initiateLogin();
    }
  }

  // Show loading screen as we redirect the user
  async model() {
    await new Promise((resolve) => setTimeout(resolve, 10_000));

    return {};
  }
}
