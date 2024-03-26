import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import CourseModel from 'codecrafters-frontend/models/course';
import CourseTesterVersionModel from 'codecrafters-frontend/models/course-tester-version';
import Store from '@ember-data/store';

export type ModelType = {
  course: CourseModel;
  testerVersion: CourseTesterVersionModel;
};

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
