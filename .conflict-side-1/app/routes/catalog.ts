import type Store from '@ember-data/store';
import { service } from '@ember/service';
import type CourseModel from 'codecrafters-frontend/models/course';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import RepositoryPoller from 'codecrafters-frontend/utils/repository-poller';
import { hash as RSVPHash } from 'rsvp';
import RouteInfoMetadata, { RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';
import type LanguageModel from 'codecrafters-frontend/models/language';

export type ModelType = {
  repositories?: RepositoryModel[];
  courses: CourseModel[];
};

export default class CatalogRoute extends BaseRoute {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ allowsAnonymousAccess: true, colorScheme: RouteColorScheme.Both });
  }

  model(): Promise<ModelType> {
    const modelPromises: {
      repositories?: Promise<RepositoryModel[]>;
      courses?: Promise<CourseModel[]>;
      _languages?: Promise<LanguageModel[]>;
    } = {};

    if (this.authenticator.isAuthenticated) {
      modelPromises.repositories = this.store.findAll('repository', {
        reload: false,
        include: RepositoryPoller.defaultIncludedResources,
      }) as unknown as Promise<RepositoryModel[]>;
    }

    modelPromises.courses = this.store.findAll('course', {
      include: 'extensions,stages,language-configurations.language.leaderboard',
    }) as unknown as Promise<CourseModel[]>;

    // Resources required by the track page
    modelPromises._languages = this.store.findAll('language', {
      include: 'leaderboard,primer-concept-group,primer-concept-group.author,primer-concept-group.concepts,primer-concept-group.concepts.author',
    }) as unknown as Promise<LanguageModel[]>;

    return RSVPHash(modelPromises) as Promise<ModelType>;
  }
}
