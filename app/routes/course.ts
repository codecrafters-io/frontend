import BaseRoute from 'codecrafters-frontend/utils/base-route';
import { all as RSVPAll } from 'rsvp';
import RepositoryPoller from 'codecrafters-frontend/utils/repository-poller';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CourseModel from 'codecrafters-frontend/models/course';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type RouterService from '@ember/routing/router-service';
import type Store from '@ember-data/store';
import type Transition from '@ember/routing/transition';
import { StepListDefinition } from 'codecrafters-frontend/utils/course-page-step-list';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';
import RouteInfoMetadata, { RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';

export type ModelType = {
  course: CourseModel;
  activeRepository: RepositoryModel;
  repositories: RepositoryModel[];
  track: string | undefined;
};

export default class CourseRoute extends BaseRoute {
  @service declare authenticator: AuthenticatorService;
  @service declare coursePageState: CoursePageStateService;
  @service declare router: RouterService;
  @service declare store: Store;

  queryParams = {
    repo: {
      refreshModel: true,
    },
    track: {
      refreshModel: true,
    },
  };

  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ colorScheme: RouteColorScheme.Both });
  }

  findOrCreateRepository(course: CourseModel, transition: Transition, repositories: RepositoryModel[]) {
    // @ts-expect-error transition.to.queryParams not typed
    if (transition.to.queryParams.repo && transition.to.queryParams.repo === 'new') {
      const existingNewRepository = this.store.peekAll('repository').find((repository) => repository.isNew);

      if (existingNewRepository) {
        existingNewRepository.course = course;
        existingNewRepository.user = this.authenticator.currentUser;

        return existingNewRepository;
      } else {
        return this.store.createRecord('repository', { course: course, user: this.authenticator.currentUser });
      }
      // @ts-expect-error transition.to.queryParams not typed
    } else if (transition.to.queryParams.repo) {
      // @ts-expect-error transition.to.queryParams not typed
      const selectedRepository = repositories.find((repository) => repository.id === transition.to.queryParams.repo);

      if (selectedRepository) {
        return selectedRepository;
      } else {
        this.router.replaceWith('course', course.slug, { queryParams: { repo: null } });
      }
      // @ts-expect-error transition.to.queryParams not typed
    } else if (transition.to.queryParams.track) {
      const lastPushedRepositoryForTrack = repositories
        // @ts-expect-error transition.to.queryParams not typed
        .filter((item) => item.language?.slug === transition.to.queryParams.track)
        .filter((item) => item.firstSubmissionCreated)
        .sort(fieldComparator('lastSubmissionAt'))
        .at(-1);

      if (lastPushedRepositoryForTrack) {
        return lastPushedRepositoryForTrack;
      } else {
        return this.store.createRecord('repository', { course: course, user: this.authenticator.currentUser });
      }
    } else {
      const lastPushedRepository = repositories
        .filter((item) => item.firstSubmissionCreated)
        .sort(fieldComparator('lastSubmissionAt'))
        .at(-1);
      const lastCreatedRepository = repositories.toSorted(fieldComparator('createdAt')).at(-1);

      if (lastPushedRepository) {
        return lastPushedRepository;
      } else if (lastCreatedRepository) {
        return lastCreatedRepository;
      } else {
        return this.store.createRecord('repository', { course: course, user: this.authenticator.currentUser });
      }
    }
  }

  async loadResources() {
    const includedCourseResources = [
      'extensions',
      'stages.solutions.language',
      'language-configurations.language',
      'stages.screencasts',
      'stages.screencasts.language',
      'stages.screencasts.user',
    ];

    const coursesPromise = this.store.findAll('course', {
      include: includedCourseResources.join(','),
    }) as unknown as Promise<CourseModel[]>;

    const repositoriesPromise = this.store.findAll('repository', {
      include: RepositoryPoller.defaultIncludedResources,
    }) as unknown as Promise<RepositoryModel[]>;

    const [allCourses, allRepositories] = await RSVPAll([coursesPromise, repositoriesPromise, this.authenticator.authenticate()]);

    return [allCourses, allRepositories];
  }

  async model(params: { course_slug: string }, transition: Transition): Promise<ModelType> {
    const [allCourses, allRepositories] = (await this.loadResources()) as [CourseModel[], RepositoryModel[]];
    const course = allCourses.find((course) => course.slug === params.course_slug) as CourseModel;

    const repositories = allRepositories.filter((repository) => {
      return !repository.isNew && repository.course.id === course.id && repository.user.id === this.authenticator.currentUser?.id;
    });

    const activeRepository = this.findOrCreateRepository(course, transition, repositories);
    this.coursePageState.setStepList(new StepListDefinition(activeRepository));

    return {
      course: course,
      activeRepository: activeRepository,
      repositories: repositories,
      track: transition.to?.queryParams['track'],
    };
  }

  redirect(_model: ModelType, transition: Transition) {
    if (transition.to?.name === 'course.index') {
      const activeStep = this.coursePageState.stepListAsStepListDefinition.activeStep;

      // @ts-expect-error activeStep might be null
      this.router.replaceWith(activeStep.routeParams.route, ...activeStep.routeParams.models);
    }

    // Schedule this to run in the next runloop, so that we aren't operating on a loading state
    next(() => {
      this.coursePageState.navigateToActiveStepIfCurrentStepIsInvalid();
    });
  }
}
