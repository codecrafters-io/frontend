import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';

export default class IndexRoute extends BaseRoute {
  @service router;

  beforeModel() {
    this.router.transitionTo('catalog');
  }
}
