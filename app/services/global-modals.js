import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

const SUBSCRIBE_MODAL = 'subscribe';
const CHECKOUT_SESSION_SUCCESSFUL_MODAL = 'checkout_session_successful';

export default class GlobalModalsService extends Service {
  @tracked currentOpenModal = null;

  get isAnyModalOpen() {
    return !!this.currentOpenModal;
  }

  get isCheckoutSessionSuccessfulModalOpen() {
    return this.currentOpenModal === CHECKOUT_SESSION_SUCCESSFUL_MODAL;
  }

  get isSubscribeModalOpen() {
    return this.currentOpenModal === SUBSCRIBE_MODAL;
  }

  openCheckoutSessionSuccessfulModal() {
    this.currentOpenModal = CHECKOUT_SESSION_SUCCESSFUL_MODAL;
  }

  openSubscribeModal() {
    this.currentOpenModal = SUBSCRIBE_MODAL;
  }

  closeModals() {
    this.currentOpenModal = null;
  }
}
