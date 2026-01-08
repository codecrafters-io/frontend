import type Store from '@ember-data/store';
import { service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';

export default class CourseFeedbackRoute extends BaseRoute {
  @service declare store: Store;

  async model() {
    // @ts-expect-error modelFor not typed
    const course = this.modelFor('course-admin').course;

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
