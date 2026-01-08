import BaseRoute from 'codecrafters-frontend/utils/base-route';
import { service } from '@ember/service';

export default class LoggedInRoute extends BaseRoute {
  @service sessionTokenStorage;

  beforeModel(transition) {
    const redirectUri = transition.to.queryParams.next;
    const sessionToken = transition.to.queryParams.session_token;

    this.sessionTokenStorage.setToken(sessionToken);
    window.location = redirectUri;
  }

  // Show loading screen as we redirect the user
  async model() {
    await new Promise((resolve) => setTimeout(resolve, 10_000));

    return {};
  }
}
