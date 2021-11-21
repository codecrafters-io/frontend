import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class GlobalModalsService extends Service {
  @tracked currentOpenModal = null;

  get isAnyModalOpen() {
    return !!this.currentOpenModal;
  }

  get isSubscribeModalOpen() {
    return this.currentOpenModal === 'subscribe';
  }

  openSubscribeModal() {
    this.currentOpenModal = 'subscribe';
  }

  closeModals() {
    this.currentOpenModal = null;
  }
}
