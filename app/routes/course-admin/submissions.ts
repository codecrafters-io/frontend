import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import type Store from '@ember-data/store';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CourseModel from 'codecrafters-frontend/models/course';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type SubmissionModel from 'codecrafters-frontend/models/submission';

export type CourseAdminSubmissionsRouteModel = {
  course: CourseModel;
  languages: LanguageModel[];
  filteredLanguageSlugs: string[];
  filteredCourseStageSlugs: string[];
  submissions: SubmissionModel[];
};

export default class CourseAdminSubmissionsRoute extends BaseRoute {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  queryParams = {
    usernames: {
      refreshModel: true,
    },
    languages: {
      refreshModel: true,
    },
    course_stage_slugs: {
      refreshModel: true,
    },
  };

  async model(params: { usernames: string; languages: string; course_stage_slugs: string }): Promise<CourseAdminSubmissionsRouteModel> {
    // @ts-expect-error modelFor not typed
    const course = this.modelFor('course-admin').course as CourseModel;

    const filters: { course_id: string; usernames?: string[]; language_slugs?: string[]; course_stage_slugs?: string[] } = {
      course_id: course.id,
    };

    if (params.usernames.length > 0) {
      filters.usernames = params.usernames.split(',');
    }

    if (params.languages.length > 0) {
      filters.language_slugs = params.languages.split(',');
    }

    if (params.course_stage_slugs.length > 0) {
      filters.course_stage_slugs = params.course_stage_slugs.split(',');
    }

    const submissions = (await this.store.query('submission', {
      ...filters,
      ...{
        include: [
          'evaluations',
          'repository.buildpack',
          'repository.language',
          'repository.user',
          'course-stage',
          'course-stage.course',
          'course-stage.course.extensions',
          'community-solution',
          'community-solution.comments',
          'community-solution.comments.user',
          'community-solution.comments.target',
          'tester-version',
        ].join(','),
      },
    })) as unknown as SubmissionModel[];

    return {
      course: course,
      languages: (await this.store.findAll('language')) as unknown as LanguageModel[],
      filteredLanguageSlugs: filters.language_slugs || [],
      filteredCourseStageSlugs: filters.course_stage_slugs || [],
      submissions: submissions,
    };
  }
}
