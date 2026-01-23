import BaseRoute from 'codecrafters-frontend/utils/base-route';
import { service } from '@ember/service';
import type SessionTokenStorageService from 'codecrafters-frontend/services/session-token-storage';
import type Transition from '@ember/routing/transition';

export default class LoggedInRoute extends BaseRoute {
  @service declare sessionTokenStorage: SessionTokenStorageService;

  beforeModel(transition: Transition) {
    const redirectUri = transition.to?.queryParams['next'] as string;
    const sessionToken = transition.to?.queryParams['session_token'] as string;

    this.sessionTokenStorage.setToken(sessionToken);
    window.location.href = redirectUri;
  }

  // Show loading screen as we redirect the user
  async model() {
    await new Promise((resolve) => setTimeout(resolve, 10_000));

    return {};
  }
}
