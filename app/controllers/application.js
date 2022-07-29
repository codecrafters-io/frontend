import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class ApplicationController extends Controller {
  @service('globalModals') globalModalsService;
  @service router;

  get currentRouteIsPay() {
    return this.router.currentRouteName === 'pay';
  }

  get isAnyModalOpen() {
    return this.globalModalsService.isAnyModalOpen;
  }
}
