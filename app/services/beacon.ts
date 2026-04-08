import Service, { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import type RouteInfo from '@ember/routing/route-info';
import RouteInfoMetadata, { HelpscoutBeaconVisibility } from 'codecrafters-frontend/utils/route-info-metadata';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

export default class HelpscoutBeaconService extends Service {
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;

  get shouldShowBeacon(): boolean {
    // Staff users and specific users see the Lobbyside widget instead of HelpScout
    const user = this.authenticator.currentUser;

    if (user?.isStaff || user?.username === 'vishaag' || user?.username === 'dronaxis') {
      return false;
    }

    let currentRoute: RouteInfo | null = this.router.currentRoute;

    while (currentRoute) {
      const metadata = currentRoute.metadata;

      if (metadata instanceof RouteInfoMetadata) {
        if (metadata.beaconVisibility === HelpscoutBeaconVisibility.Hidden) {
          return false;
        } else if (metadata.beaconVisibility === HelpscoutBeaconVisibility.Visible) {
          return true;
        }
      }

      currentRoute = currentRoute.parent;
    }

    // Default to showing the beacon if no route specifies otherwise
    return true;
  }
}

// Type declaration for service injection
declare module '@ember/service' {
  interface Registry {
    beacon: HelpscoutBeaconService;
  }
}
