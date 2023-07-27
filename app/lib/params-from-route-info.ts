import type RouteInfo from '@ember/routing/route-info';

export default function paramsFromRouteInfo(routeInfo: RouteInfo) {
  let currentRouteInfo = routeInfo;
  let params = { ...currentRouteInfo.params };

  while (true) {
    if (currentRouteInfo.paramNames.length > 0) {
      params = { ...currentRouteInfo.params, ...params };
    }

    if (!currentRouteInfo.parent) {
      return params;
    }

    currentRouteInfo = currentRouteInfo.parent;
  }
}
