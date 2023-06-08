import Service, { service } from '@ember/service';
import RouterService from '@ember/routing/router-service';

export default class ColorScheme extends Service {
  @service declare router: RouterService;

  get isDark(): boolean {
    if (this.router.currentRouteName === 'badges') {
      return true;
    } else {
      return false;
    }
  }

  get isLight(): boolean {
    return !this.isDark;
  }
}
