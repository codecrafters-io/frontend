import Route from '@ember/routing/route';
import RouteInfoMetadata from 'codecrafters-frontend/utils/route-info-metadata';

export default class DemoRoute extends Route {
  buildRouteInfoMetadata(): RouteInfoMetadata {
    return new RouteInfoMetadata({ supportsDarkMode: true });
  }
}
