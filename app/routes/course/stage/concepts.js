import BaseRoute from 'codecrafters-frontend/lib/base-route';

export default class CodeExamplesRoute extends BaseRoute {
  async model() {
    return {
      allConcepts: await this.store.findAll('concept'),
      courseStage: this.modelFor('course.stage'),
    };
  }
}
