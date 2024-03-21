import Controller from '@ember/controller';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';

export default class SettingsController extends Controller {
  @service declare router: RouterService;

  get activeTab() {
    return this.tabs.find((tab) => tab.route === this.router.currentRouteName);
  }

  get tabs() {
    return [
      { route: 'settings.profile', label: 'Profile' },
      { route: 'settings.billing', label: 'Billing' },
    ];
  }
}
