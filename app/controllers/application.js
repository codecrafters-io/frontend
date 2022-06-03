import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
  queryParams = ['action'];
  @service('globalModals') globalModalsService;
  @tracked action = null;

  get isAnyModalOpen() {
    return this.globalModalsService.isAnyModalOpen;
  }

  get isCheckoutSessionSuccessfulModalOpen() {
    return this.globalModalsService.isCheckoutSessionSuccessfulModalOpen;
  }

  @action
  handleDidInsert() {
    if (this.action === 'checkout_session_successful') {
      this.globalModalsService.openCheckoutSessionSuccessfulModal();
    }
  }
}
