import BaseRoute from 'codecrafters-frontend/utils/base-route';
import RouteInfoMetadata from 'codecrafters-frontend/utils/route-info-metadata';

export default class NotFoundRoute extends BaseRoute {
  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ allowsAnonymousAccess: true });
  }
}
