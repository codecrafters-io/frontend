import ApplicationRoute from 'codecrafters-frontend/lib/application-route';
import { service } from '@ember/service';

export default class LoggedInRoute extends ApplicationRoute {
  @service sessionTokenStorage;

  beforeModel(transition) {
    const redirectUri = transition.to.queryParams.next;
    const sessionToken = transition.to.queryParams.session_token;

    this.sessionTokenStorage.setToken(sessionToken);
    window.location = redirectUri;
  }
}
