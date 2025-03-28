import Route from '@ember/routing/route';
import RouteInfoMetadata, { RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';

export default class DemoRoute extends Route {
  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ colorScheme: RouteColorScheme.Both });
  }
}
