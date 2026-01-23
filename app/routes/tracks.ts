import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';

export default class TracksRoute extends BaseRoute {
  @service declare router: RouterService;

  beforeModel() {
    this.router.transitionTo('catalog');
  }
}
