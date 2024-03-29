import type Store from '@ember-data/store';
import type RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import type UserModel from 'codecrafters-frontend/models/user';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import BaseRoute from 'codecrafters-frontend/utils/base-route';

export type ModelType = UserModel | undefined;

export default class UserRoute extends BaseRoute {
  allowsAnonymousAccess = true;
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;
  @service declare store: Store;

  afterModel(model: ModelType): void {
    if (!model) {
      this.router.transitionTo('not-found');
    }
  }

  async model(params: { username: string }): Promise<ModelType> {
    const users = (await this.store.query('user', {
      username: params.username,
      include: 'course-participations.language,course-participations.course.stages,course-participations.current-stage,profile-events',
    })) as unknown as UserModel[];

    return users[0];
  }
}
