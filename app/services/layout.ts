import Service, { service } from '@ember/service';
import RouteInfoMetadata from 'codecrafters-frontend/utils/route-info-metadata';
import RouterService from '@ember/routing/router-service';

export default class LayoutService extends Service {
  @service declare router: RouterService;

  get currentRouteHidesHeaderAndFooter(): boolean {
    const metadata = this.router.currentRoute?.metadata;

    return metadata instanceof RouteInfoMetadata && !metadata.shouldShowHeaderAndFooter;
  }

  get shouldShowFooter(): boolean {
    return this.shouldShowHeader; // Same for now
  }

  get shouldShowHeader(): boolean {
    if (this.currentRouteHidesHeaderAndFooter) {
      return false;
    }

    return !(
      this.router.currentRouteName === 'course' ||
      this.router.currentRouteName.startsWith('course.') ||
      this.router.currentRouteName.startsWith('course-admin')
    );
  }
}
