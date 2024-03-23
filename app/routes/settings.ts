import type RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import type UserModel from 'codecrafters-frontend/models/user';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import BaseRoute from 'codecrafters-frontend/utils/base-route';

export type ModelType = {
  user: UserModel;
};

export default class SettingsRoute extends BaseRoute {
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;

  async model(): Promise<ModelType> {
    await this.authenticator.authenticate();

    return {
      user: this.authenticator.currentUser!,
    };
  }
}
