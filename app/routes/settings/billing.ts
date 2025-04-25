import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type Store from '@ember-data/store';

export default class SettingsBillingRoute extends Route {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  async model() {
    const user = this.authenticator.currentUser;

    if (!user) {
      throw new Error('User must be authenticated to access billing settings');
    }

    return {
      user,
    };
  }
}
