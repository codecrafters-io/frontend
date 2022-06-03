import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

const CHECKOUT_SESSION_SUCCESSFUL_MODAL = 'checkout_session_successful';

export default class GlobalModalsService extends Service {
  @tracked currentOpenModal = null;

  get isAnyModalOpen() {
    return !!this.currentOpenModal;
  }

  get isCheckoutSessionSuccessfulModalOpen() {
    return this.currentOpenModal === CHECKOUT_SESSION_SUCCESSFUL_MODAL;
  }

  openCheckoutSessionSuccessfulModal() {
    this.currentOpenModal = CHECKOUT_SESSION_SUCCESSFUL_MODAL;
  }

  closeModals() {
    this.currentOpenModal = null;
  }
}
