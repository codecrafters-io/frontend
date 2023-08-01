import { inject as service } from '@ember/service';
import { TrackedArray } from 'tracked-built-ins';
import BaseRoute from 'codecrafters-frontend/lib/base-route';

export default class CourseUpdatessRoute extends BaseRoute {
  @service authenticator;
  @service store;

  courseDefinitionUpdates = new TrackedArray();

  async model() {
    let course = this.modelFor('course-admin').course;

    this.courseDefinitionUpdates = await this.store.findAll('course-definition-update');

    return {
      course: course,
      courseDefinitionUpdates: this.courseDefinitionUpdates,
    };
  }
}
