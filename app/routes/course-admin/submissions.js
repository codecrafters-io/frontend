import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';

export default class CourseAdminSubmissionsRoute extends BaseRoute {
  @service authenticator;
  @service store;

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

  async model(params) {
    let course = this.modelFor('course-admin').course;

    let filters = { course_id: course.id };

    if (params.usernames.length > 0) {
      filters.usernames = params.usernames.split(',');
    }

    if (params.languages.length > 0) {
      filters.language_slugs = params.languages.split(',');
    }

    if (params.course_stage_slugs.length > 0) {
      filters.course_stage_slugs = params.course_stage_slugs.split(',');
    }

    let submissions = await this.store.query('submission', {
      ...filters,
      ...{
        include: [
          'evaluations',
          'repository.language',
          'repository.user',
          'course-stage',
          'course-stage.course',
          'course-stage.course.extensions',
          'community-course-stage-solution',
          'community-course-stage-solution.comments',
          'community-course-stage-solution.comments.user',
          'community-course-stage-solution.comments.target',
          'tester-version',
        ].join(','),
      },
    });

    return {
      course: course,
      languages: await this.store.findAll('language'),
      filteredLanguageSlugs: filters.language_slugs || [],
      filteredCourseStageSlugs: filters.course_stage_slugs || [],
      submissions: submissions,
    };
  }
}
