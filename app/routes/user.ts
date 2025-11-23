import type Store from '@ember-data/store';
import type RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import type UserModel from 'codecrafters-frontend/models/user';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type MetaDataService from 'codecrafters-frontend/services/meta-data';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import RouteInfoMetadata, { HelpscoutBeaconVisibility, RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';

export type ModelType = UserModel | undefined;

export default class UserRoute extends BaseRoute {
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

    this.metaData.imageUrl = `https://og.codecrafters.io/api/user_profile/${model.username}`;
    this.metaData.title = `${model.username}'s CodeCrafters Profile`;
    this.metaData.description = `View ${model.username}'s profile on CodeCrafters`;
  }

  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({
      allowsAnonymousAccess: true,
      beaconVisibility: HelpscoutBeaconVisibility.Hidden,
      colorScheme: RouteColorScheme.Light,
    });
  }

  deactivate() {
    this.metaData.imageUrl = this.previousMetaImageUrl;
    this.metaData.title = this.previousMetaTitle;
    this.metaData.description = this.previousMetaDescription;
  }

  async #fetchUserRecord(username: string) {
    return (
      (await this.store.query('user', {
        username,
        include: 'course-participations.language,course-participations.course.stages,course-participations.current-stage,profile-events',
      })) as unknown as UserModel[]
    )[0];
  }

  #findCachedUserRecord(username: string) {
    return this.store.peekAll('user').find((u) => u.username === username);
  }

  async model({ username }: { username: string }): Promise<ModelType> {
    // Look up the record in the store, in case it's already there,
    // for example, inserted via FastBoot Shoebox
    const existingRecord = this.#findCachedUserRecord(username);

    if (existingRecord) {
      // Trigger a fetch anyway to refresh the data
      this.#fetchUserRecord(username);

      // Return existing record, otherwise the page will blink after loading
      return existingRecord;
    }

    // If the record doesn't exist - fetch it and return
    return this.#fetchUserRecord(username);
  }
}
