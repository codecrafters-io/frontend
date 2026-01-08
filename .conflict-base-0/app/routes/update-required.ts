import BaseRoute from 'codecrafters-frontend/utils/base-route';
import RouteInfoMetadata, { RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';

export default class UpdateRequiredRoute extends BaseRoute {
  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ colorScheme: RouteColorScheme.Both });
  }
}
