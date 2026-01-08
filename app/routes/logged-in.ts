import BaseRoute from 'codecrafters-frontend/utils/base-route';
import { service } from '@ember/service';
import type SessionTokenStorageService from 'codecrafters-frontend/services/session-token-storage';
import type Transition from '@ember/routing/transition';

export default class LoggedInRoute extends BaseRoute {
  @service declare sessionTokenStorage: SessionTokenStorageService;

  beforeModel(transition: Transition) {
    // @ts-expect-error transition.to.queryParams not typed
    const redirectUri = transition.to.queryParams.next;
    // @ts-expect-error transition.to.queryParams not typed
    const sessionToken = transition.to.queryParams.session_token;

    if (sessionToken && redirectUri) {
      this.sessionTokenStorage.setToken(sessionToken);
      // @ts-expect-error window.location assignment not fully typed
      window.location = redirectUri;
    }
  }

  // Show loading screen as we redirect the user
  async model() {
    await new Promise((resolve) => setTimeout(resolve, 10_000));

    return {};
  }
}
