import Service, { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import type RouteInfo from '@ember/routing/route-info';
import RouteInfoMetadata, { HelpscoutBeaconVisibility } from 'codecrafters-frontend/utils/route-info-metadata';
import type LiveCallWidgetService from 'codecrafters-frontend/services/live-call-widget';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

export default class HelpscoutBeaconService extends Service {
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;
  @service declare liveCallWidget: LiveCallWidgetService;

  get shouldShowBeacon(): boolean {
    // Staff users see the live call widget admin panel instead of HelpScout
    if (this.authenticator.currentUser?.isStaff) {
      return false;
    }

    if (this.liveCallWidget.shouldShowWidget) {
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
