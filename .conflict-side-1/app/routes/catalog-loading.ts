import Route from '@ember/routing/route';
import RouteInfoMetadata, { RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';

export default class CatalogLoadingRoute extends Route {
  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ allowsAnonymousAccess: true, colorScheme: RouteColorScheme.Both });
  }
}
