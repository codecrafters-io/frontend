import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';

export default class CourseUpdatessRoute extends BaseRoute {
  @service authenticator;
  @service store;

  async model() {
    let course = this.modelFor('course-admin').course;

    await this.store.query('course-definition-update', {
      course_id: course.id,
      include: ['course', 'applier'].join(','),
    });

    return {
      course: course,
    };
  }
}
