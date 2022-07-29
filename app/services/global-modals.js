import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class GlobalModalsService extends Service {
  @tracked currentOpenModal = null;

  get isAnyModalOpen() {
    return !!this.currentOpenModal;
  }

  closeModals() {
    this.currentOpenModal = null;
  }
}
