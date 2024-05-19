import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';

export default class DemoIndexRoute extends Route {
  @service declare router: RouterService;

  redirect() {
    this.router.transitionTo('demo.code-mirror');
  }
}
