import { service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type Store from '@ember-data/store';
import type { ModelType as CourseAdminModelType } from 'codecrafters-frontend/routes/course-admin';
import type CourseModel from 'codecrafters-frontend/models/course';

export interface ModelType {
  course: CourseModel;
}

export default class CourseUpdatesRoute extends BaseRoute {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  async model(): Promise<ModelType> {
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
