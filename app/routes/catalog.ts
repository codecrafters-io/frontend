import type Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import type CourseModel from 'codecrafters-frontend/models/course';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import RepositoryPoller from 'codecrafters-frontend/utils/repository-poller';
import RSVP from 'rsvp';

export type ModelType = {
  repositories?: RepositoryModel[];
  courses: CourseModel[];
};

export default class CatalogRoute extends BaseRoute {
  allowsAnonymousAccess = true;
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  model(): Promise<ModelType> {
    const modelPromises: {
      repositories?: Promise<RepositoryModel[]>;
      courses?: Promise<CourseModel[]>;
    } = {};

    if (this.authenticator.isAuthenticated) {
      modelPromises.repositories = this.store.findAll('repository', {
        reload: false,
        include: RepositoryPoller.defaultIncludedResources,
      }) as unknown as Promise<RepositoryModel[]>;
    }

    modelPromises.courses = this.store.findAll('course', {
      include: 'stages,language-configurations.language',
    }) as unknown as Promise<CourseModel[]>;

    return RSVP.hash(modelPromises) as Promise<ModelType>;
  }
}
