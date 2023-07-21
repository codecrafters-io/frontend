import Service, { service } from '@ember/service';
import RouterService from '@ember/routing/router-service';

export default class ContainerWidthService extends Service {
  @service declare router: RouterService;

  get maxWidthIsXl(): boolean {
    if (this.router.currentRouteName.startsWith('course-admin')) {
      return true;
    } else {
      return false;
    }
  }

  get maxWidthIsLg(): boolean {
    return !this.maxWidthIsXl;
  }
}
