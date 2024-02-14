import BaseRoute from 'codecrafters-frontend/utils/base-route';
import { inject as service } from '@ember/service';

export default class CodeExamplesRoute extends BaseRoute {
  @service store;

  async model() {
    if (this.authenticator.isAuthenticated) {
      await this.store.findAll('concept-engagement', {
        include: 'concept,user',
      });
    }

    return {
      allConcepts: await this.store.findAll('concept', { include: 'author,questions' }),
      courseStage: this.modelFor('course.stage').courseStage,
    };
  }
}
