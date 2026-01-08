import BaseRoute from 'codecrafters-frontend/utils/base-route';
import RouteInfoMetadata, { RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';

export default class DebugRoute extends BaseRoute {
  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ allowsAnonymousAccess: true, colorScheme: RouteColorScheme.Light });
  }
}
