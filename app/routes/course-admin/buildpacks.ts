import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/lib/base-route';
import Store from '@ember-data/store';

export default class BuildpacksRoute extends BaseRoute {
  @service declare store: Store;

  async model() {
    // @ts-ignore
    const course = this.modelFor('course-admin').course;

    await this.store.query('buildpack', {
      course_id: course.id,
      include: ['course', 'language'].join(','),
    });

    return {
      course: course,
    };
  }
}
