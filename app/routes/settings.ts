import type RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import type UserModel from 'codecrafters-frontend/models/user';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import RouteInfoMetadata, { RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';

export type ModelType = {
  user: UserModel;
};

export default class SettingsRoute extends BaseRoute {
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;

  buildRouteInfoMetadata(): RouteInfoMetadata {
    return new RouteInfoMetadata({ colorScheme: RouteColorScheme.Both });
  }

  async model(): Promise<ModelType> {
    await this.authenticator.authenticate();

    return {
      user: this.authenticator.currentUser!,
    };
  }
}
