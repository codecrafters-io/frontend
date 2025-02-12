import type Store from '@ember-data/store';
import type RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import type UserModel from 'codecrafters-frontend/models/user';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type MetaDataService from 'codecrafters-frontend/services/meta-data';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import RouteInfoMetadata, { HelpscoutBeaconVisibility } from 'codecrafters-frontend/utils/route-info-metadata';
import config from 'codecrafters-frontend/config/environment';

export type ModelType = UserModel | undefined;

export default class UserRoute extends BaseRoute {
  allowsAnonymousAccess = true;
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;
  @service declare store: Store;
  @service declare metaData: MetaDataService;

  previousMetaImageUrl: string | undefined;
  previousMetaTitle: string | undefined;
  previousMetaDescription: string | undefined;

  afterModel(model: ModelType): void {
    if (!model) {
      this.router.transitionTo('not-found');

      return;
    }

    this.previousMetaImageUrl = this.metaData.imageUrl;
    this.previousMetaTitle = this.metaData.title;
    this.previousMetaDescription = this.metaData.description;

    this.metaData.imageUrl = `${config.x.metaTagUserProfilePictureBaseURL}${model.username}`;
    this.metaData.title = `${model.username}'s CodeCrafters Profile`;
    this.metaData.description = `View ${model.username}'s profile on CodeCrafters`;
  }

  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ beaconVisibility: HelpscoutBeaconVisibility.Hidden });
  }

  deactivate() {
    this.metaData.imageUrl = this.previousMetaImageUrl;
    this.metaData.title = this.previousMetaTitle;
    this.metaData.description = this.previousMetaDescription;
  }

  async model(params: { username: string }): Promise<ModelType> {
    const users = (await this.store.query('user', {
      username: params.username,
      include: 'course-participations.language,course-participations.course.stages,course-participations.current-stage,profile-events',
    })) as unknown as UserModel[];

    return users[0];
  }
}
