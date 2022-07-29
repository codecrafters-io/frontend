import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
  queryParams = ['action'];
  @service('globalModals') globalModalsService;
  @service router;
  @tracked action = null;

  get currentRouteIsPay() {
    return this.router.currentRouteName === 'pay';
  }

  get isAnyModalOpen() {
    return this.globalModalsService.isAnyModalOpen;
  }
}
