import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';

export default class CoursesRoute extends BaseRoute {
  @service router;

  beforeModel() {
    this.router.transitionTo('catalog');
  }
}
