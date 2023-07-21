import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/lib/base-route';

export default class CourseAdminUpdateRoute extends BaseRoute {
  @service authenticator;
  @service store;

  async model(params) {
    let course = this.modelFor('course-admin').course;

    return {
      course: course,
    };
  }
}
