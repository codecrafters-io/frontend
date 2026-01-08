import BaseRoute from 'codecrafters-frontend/utils/base-route';

export default class CoursesRoute extends BaseRoute {
  beforeModel() {
    this.router.transitionTo('catalog');
  }
}
