import Route from '@ember/routing/route';
import RouteInfoMetadata, { RouteColorSchemes } from 'codecrafters-frontend/utils/route-info-metadata';

export default class DemoRoute extends Route {
  buildRouteInfoMetadata(): RouteInfoMetadata {
    return new RouteInfoMetadata({ colorScheme: RouteColorSchemes.Both });
  }
}
