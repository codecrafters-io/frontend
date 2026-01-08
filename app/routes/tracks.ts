import { service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import type RouterService from '@ember/routing/router-service';

export default class TracksRoute extends BaseRoute {
  @service declare router: RouterService;

  beforeModel() {
    this.router.transitionTo('catalog');
  }
}
