import Service, { service } from '@ember/service';
import RouterService from '@ember/routing/router-service';

export default class ContainerWidthService extends Service {
  @service declare router: RouterService;

  get maxWidthIsLg(): boolean {
    return !this.maxWidthIsXl;
  }

  get maxWidthIsXl(): boolean {
    if (this.router.currentRouteName.startsWith('course-admin')) {
      return true;
    } else {
      return false;
    }
  }
}
