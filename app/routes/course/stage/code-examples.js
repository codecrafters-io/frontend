import BaseRoute from 'codecrafters-frontend/lib/base-route';

export default class CodeExamplesRoute extends BaseRoute {
  async model() {
    return this.modelFor('course.stage');
  }
}
