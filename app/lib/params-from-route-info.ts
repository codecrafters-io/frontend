import type RouteInfo from '@ember/routing/route-info';

export default function paramsFromRouteInfo(routeInfo: RouteInfo): [string, string][] {
  let currentRouteInfo = routeInfo;
  let params = [] as [string, string][];

  while (true) {
    for (const paramName of currentRouteInfo.paramNames) {
      params.push([paramName, currentRouteInfo.params[paramName] as string]);
    }

    if (!currentRouteInfo.parent) {
      return params.reverse();
    }

    currentRouteInfo = currentRouteInfo.parent;
  }
}
