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
    course_stages: {
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

    if (params.course_stages.length > 0) {
      filters.course_stages = params.course_stages.split(',');
    }

    let submissions = await this.store.query('submission', {
      ...filters,
      ...{
        include: [
          'evaluations',
          'repository.language',
          'repository.user',
          'course-stage',
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
      submissions: submissions,
    };
  }
}
