import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import Store from '@ember-data/store';

export default class CourseTesterVersionsRoute extends BaseRoute {
  @service declare store: Store;

  async model() {
    // @ts-ignore
    const course = this.modelFor('course-admin').course;

    await this.store.query('course-tester-version', {
      course_id: course.id,
      include: ['course', 'activator'].join(','),
    });

    return {
      course: course,
    };
  }
}
