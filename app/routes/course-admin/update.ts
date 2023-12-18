import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import Store from '@ember-data/store';

export default class CourseAdminUpdateRoute extends BaseRoute {
  @service declare store: Store;

  async model(params: { update_id: string }) {
    // @ts-ignore
    const course = this.modelFor('course-admin').course;
    const update = await this.store.findRecord('course-definition-update', params.update_id, { include: 'applier,course' });

    return {
      course: course,
      update: update,
    };
  }
}
