import Service, { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import type RouteInfo from '@ember/routing/route-info';
import RouteInfoMetadata, { HelpscoutBeaconVisibility } from 'codecrafters-frontend/utils/route-info-metadata';

export default class BeaconService extends Service {
  @service declare router: RouterService;

  get shouldShowBeacon(): boolean {
    let currentRoute: RouteInfo | null = this.router.currentRoute;
    console.log('shouldShowBeacon called', currentRoute, currentRoute?.metadata);

    while (currentRoute) {
      const metadata = currentRoute.metadata;

      if (metadata instanceof RouteInfoMetadata) {
        if (metadata.beaconVisibility === HelpscoutBeaconVisibility.Hide) {
          console.log('shouldShowBeacon returning false');
          return false;
        } else if (metadata.beaconVisibility === HelpscoutBeaconVisibility.Show) {
          console.log('shouldShowBeacon returning true');
          return true;
        }
      }

      currentRoute = currentRoute.parent;
    }

    // Default to showing the beacon if no route specifies otherwise
    console.log('shouldShowBeacon returning true');
    return true;
  }
}

// Type declaration for service injection
declare module '@ember/service' {
  interface Registry {
    beacon: BeaconService;
  }
}
