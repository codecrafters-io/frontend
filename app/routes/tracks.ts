import BaseRoute from 'codecrafters-frontend/utils/base-route';

export default class TracksRoute extends BaseRoute {
  beforeModel() {
    this.router.transitionTo('catalog');
  }
}
