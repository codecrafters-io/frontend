import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import scrollToTop from 'codecrafters-frontend/utils/scroll-to-top';
import Store from '@ember-data/store';
import { inject as service } from '@ember/service';

export default class WelcomeRoute extends BaseRoute {
  @service authenticator!: AuthenticatorService;
  @service store!: Store;

  activate() {
    scrollToTop();
  }

  async model() {
    return {};
  }
}
