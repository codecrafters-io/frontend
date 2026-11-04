import BaseRoute from 'codecrafters-frontend/utils/base-route';
import RepositoryPoller from 'codecrafters-frontend/utils/repository-poller';
import RouteInfoMetadata, { HelpscoutBeaconVisibility, RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';
import type CourseModel from 'codecrafters-frontend/models/course';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type Store from '@ember-data/store';
import { all as RSVPAll } from 'rsvp';
import { service } from '@ember/service';

export default class InterviewBaseRoute extends BaseRoute {
  @service declare store: Store;

  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({
      beaconVisibility: HelpscoutBeaconVisibility.Hidden,
      colorScheme: RouteColorScheme.Dark,
      shouldShowHeaderAndFooter: false,
    });
  }

  async loadCourseAndRepositories(courseSlug: string): Promise<[CourseModel | undefined, RepositoryModel[]]> {
    const coursesPromise = this.store.findAll('course', {
      include: 'extensions,stages,language-configurations.language',
    }) as unknown as Promise<CourseModel[]>;

    const repositoriesPromise = this.store.findAll('repository', {
      include: RepositoryPoller.defaultIncludedResources,
    }) as unknown as Promise<RepositoryModel[]>;

    const [allCourses, allRepositories] = await RSVPAll([coursesPromise, repositoriesPromise, this.authenticator.authenticate()]);

    return [allCourses.find((item) => item.slug === courseSlug), allRepositories];
  }

  selectRepository(course: CourseModel, allRepositories: RepositoryModel[], repositoryId: string | null | undefined): RepositoryModel | undefined {
    const repositories = allRepositories.filter((repository) => {
      return !repository.isNew && repository.course.id === course.id && repository.user.id === this.authenticator.currentUser?.id;
    });

    if (repositoryId) {
      return repositories.find((repository) => repository.id === repositoryId);
    }

    return repositories
      .filter((repository) => repository.firstSubmissionCreated)
      .sort(fieldComparator('lastSubmissionAt'))
      .at(-1);
  }
}
