import type Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import type CourseModel from 'codecrafters-frontend/models/course';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import RepositoryPoller from 'codecrafters-frontend/utils/repository-poller';
import { hash as RSVPHash } from 'rsvp';
import RouteInfoMetadata, { RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';
import type ConceptGroupModel from 'codecrafters-frontend/models/concept-group';
import type ConceptModel from 'codecrafters-frontend/models/concept';

export type ModelType = {
  repositories?: RepositoryModel[];
  courses: CourseModel[];
};

export default class CatalogRoute extends BaseRoute {
  allowsAnonymousAccess = true;
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  buildRouteInfoMetadata(): RouteInfoMetadata {
    return new RouteInfoMetadata({ colorScheme: RouteColorScheme.Both });
  }

  model(): Promise<ModelType> {
    const modelPromises: {
      repositories?: Promise<RepositoryModel[]>;
      courses?: Promise<CourseModel[]>;
      _conceptGroups?: Promise<ConceptGroupModel[]>;
      _concepts?: Promise<ConceptModel[]>;
    } = {};

    if (this.authenticator.isAuthenticated) {
      modelPromises.repositories = this.store.findAll('repository', {
        reload: false,
        include: RepositoryPoller.defaultIncludedResources,
      }) as unknown as Promise<RepositoryModel[]>;
    }

    modelPromises.courses = this.store.findAll('course', {
      include: 'extensions,stages,language-configurations.language',
    }) as unknown as Promise<CourseModel[]>;

    // Resources required by the track page
    modelPromises._conceptGroups = this.store.findAll('concept-group', { include: 'author' }) as unknown as Promise<ConceptGroupModel[]>;
    modelPromises._concepts = this.store.findAll('concept', { include: 'author,questions' }) as unknown as Promise<ConceptModel[]>;

    return RSVPHash(modelPromises) as Promise<ModelType>;
  }
}
