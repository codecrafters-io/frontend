import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';

export default class IndexRoute extends ApplicationRoute {
  @service router;

  beforeModel() {
    this.router.transitionTo('tracks');
  }
}
