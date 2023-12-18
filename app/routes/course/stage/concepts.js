import BaseRoute from 'codecrafters-frontend/utils/base-route';
import { inject as service } from '@ember/service';

export default class CodeExamplesRoute extends BaseRoute {
  @service store;

  async model() {
    return {
      allConcepts: await this.store.findAll('concept', { include: 'author,questions' }),
      courseStage: this.modelFor('course.stage').courseStage,
    };
  }
}
