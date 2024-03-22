import Controller from '@ember/controller';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import type { ModelType } from 'codecrafters-frontend/routes/settings';

export default class SettingsController extends Controller {
  declare model: ModelType;

  @service declare router: RouterService;

  get activeTab() {
    return this.tabs.find((tab) => tab.route === this.router.currentRouteName);
  }

  get tabs() {
    return [
      { route: 'settings.profile', label: 'Profile' },
      { route: 'settings.account', label: 'Account' },
    ];
  }
}
