import BaseRoute from 'codecrafters-frontend/utils/base-route';
import InterviewMilestone from 'codecrafters-frontend/utils/interview-milestone';
import RepositoryPoller from 'codecrafters-frontend/utils/repository-poller';
import RouteInfoMetadata, { HelpscoutBeaconVisibility, RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type ChallengeInterviewModel from 'codecrafters-frontend/models/challenge-interview';
import type CourseModel from 'codecrafters-frontend/models/course';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type RouterService from '@ember/routing/router-service';
import type Store from '@ember-data/store';
import { all as RSVPAll } from 'rsvp';
import { service } from '@ember/service';

export type ModelType = {
  course: CourseModel;
  interview: ChallengeInterviewModel | null;
  milestone: InterviewMilestone;
  repository: RepositoryModel;
};

type Params = {
  course_slug: string;
  interview?: string | null;
  milestone_slug: string;
  repo?: string | null;
};

export default class CourseInterviewRoute extends BaseRoute {
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;
  @service declare store: Store;

  queryParams = {
    interview: {
      refreshModel: true,
    },
    repo: {
      refreshModel: true,
    },
  };

  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ beaconVisibility: HelpscoutBeaconVisibility.Hidden, colorScheme: RouteColorScheme.Dark });
  }

  async findInterview(interviewId: string | null | undefined): Promise<ChallengeInterviewModel | null> {
    if (!interviewId) {
      return null;
    }

    try {
      return await this.store.findRecord('challenge-interview', interviewId, { reload: true });
    } catch {
      return null;
    }
  }

  async loadResources(): Promise<[CourseModel[], RepositoryModel[]]> {
    const coursesPromise = this.store.findAll('course', {
      include: 'extensions,stages,language-configurations.language',
    }) as unknown as Promise<CourseModel[]>;

    const repositoriesPromise = this.store.findAll('repository', {
      include: RepositoryPoller.defaultIncludedResources,
    }) as unknown as Promise<RepositoryModel[]>;

    const [allCourses, allRepositories] = await RSVPAll([coursesPromise, repositoriesPromise, this.authenticator.authenticate()]);

    return [allCourses, allRepositories];
  }

  async model(params: Params): Promise<ModelType | undefined> {
    const [allCourses, allRepositories] = await this.loadResources();
    const course = allCourses.find((item) => item.slug === params.course_slug);

    if (!course) {
      this.router.replaceWith('not-found');

      return;
    }

    if (!this.authenticator.currentUser?.isStaff) {
      this.router.replaceWith('course', course.slug);

      return;
    }

    const repository = this.selectRepository(course, allRepositories, params.repo);
    const milestone = repository ? InterviewMilestone.fromSlug(repository, params.milestone_slug) : null;

    if (!repository || !milestone) {
      this.router.replaceWith('course', course.slug);

      return;
    }

    return {
      course,
      interview: await this.findInterview(params.interview),
      milestone,
      repository,
    };
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
