import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default class ApplicationController extends Controller {
  @service('globalModals') globalModalsService;

  get isAnyModalOpen() {
    return this.globalModalsService.isAnyModalOpen;
  }

  get isCheckoutSessionSuccessfulModalOpen() {
    return this.globalModalsService.isCheckoutSessionSuccessfulModalOpen;
  }

  get isSubscribeModalOpen() {
    return this.globalModalsService.isSubscribeModalOpen;
  }
}
