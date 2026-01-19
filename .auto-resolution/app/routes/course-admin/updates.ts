import { service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import type Store from '@ember-data/store';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CourseModel from 'codecrafters-frontend/models/course';
import type { ModelType as CourseAdminModelType } from 'codecrafters-frontend/routes/course-admin';

export type CourseAdminUpdatesRouteModel = {
  course: CourseModel;
};

export default class CourseUpdatessRoute extends BaseRoute {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  async model(): Promise<CourseAdminUpdatesRouteModel> {
    const course = (this.modelFor('course-admin') as CourseAdminModelType).course;

    await this.store.query('course-definition-update', {
      course_id: course.id,
      include: ['course', 'applier'].join(','),
    });

    return {
      course: course,
    };
  }
}
