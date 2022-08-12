import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class ApplicationController extends Controller {
  @service('globalModals') globalModalsService;

  get isAnyModalOpen() {
    return this.globalModalsService.isAnyModalOpen;
  }
}
