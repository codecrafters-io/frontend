import { service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import type Store from '@ember-data/store';
import type { ModelType as CourseAdminModelType } from 'codecrafters-frontend/routes/course-admin';

export default class CourseUpdatesRoute extends BaseRoute {
  @service declare store: Store;

  async model() {
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
