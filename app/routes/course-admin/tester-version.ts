import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import Store from '@ember-data/store';

export default class CourseAdminTesterVersionRoute extends BaseRoute {
  @service declare store: Store;

  async model(params: { tester_version_id: string }) {
    // @ts-ignore
    const course = this.modelFor('course-admin').course;
    const testerVersion = await this.store.findRecord('course-tester-version', params.tester_version_id, { include: 'activator,course' });

    return {
      course: course,
      testerVersion: testerVersion,
    };
  }
}
