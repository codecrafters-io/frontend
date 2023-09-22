import Service, { service } from '@ember/service';
import RouterService from '@ember/routing/router-service';

export default class LayoutService extends Service {
  @service declare router: RouterService;

  get shouldShowHeader(): boolean {
    if (
      this.router.currentRouteName === 'course' ||
      this.router.currentRouteName.startsWith('course.') ||
      this.router.currentRouteName.startsWith('course-admin')
    ) {
      return false;
    } else {
      return true;
    }
  }

  get shouldShowFooter(): boolean {
    return this.shouldShowHeader; // Same for now
  }
}
