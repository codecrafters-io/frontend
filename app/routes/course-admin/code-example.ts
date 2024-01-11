import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import Store from '@ember-data/store';

export default class CodeExampleRoute extends BaseRoute {
  @service declare store: Store;

  async model(params: { code_example_id: string }) {
    // @ts-ignore
    const course = this.modelFor('course-admin').course;
    const solution = await this.store.findRecord('community-course-stage-solution', params.code_example_id, {
      include: 'user,language,comments,comments.user,comments.target,course-stage',
    });

    return {
      course: course,
      solution: solution,
    };
  }
}
