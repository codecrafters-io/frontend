import { service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import type Store from '@ember-data/store';
import type { ModelType as CourseAdminModelType } from 'codecrafters-frontend/routes/course-admin';

export default class CourseFeedbackRoute extends BaseRoute {
  @service declare store: Store;

  async model() {
    const course = (this.modelFor('course-admin') as CourseAdminModelType).course;

    const filters = { course_id: course.id };

    const feedbackSubmissions = await this.store.query('course-stage-feedback-submission', {
      ...filters,
      ...{
        include: ['course-stage', 'course-stage.course', 'language', 'user'].join(','),
      },
    });

    return {
      course: course,
      feedbackSubmissions: feedbackSubmissions,
    };
  }
}
