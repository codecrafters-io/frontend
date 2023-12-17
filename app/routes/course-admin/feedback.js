import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';

export default class CourseFeedbackRoute extends BaseRoute {
  @service authenticator;
  @service store;

  async model() {
    let course = this.modelFor('course-admin').course;

    let filters = { course_id: course.id };

    let feedbackSubmissions = await this.store.query('course-stage-feedback-submission', {
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
