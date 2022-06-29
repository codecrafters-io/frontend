import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ModalBodyComponent extends Component {
  @service('globalModals') globalModalsService;

  @action
  handleClickOutside() {
    if (this.args.allowManualClose) {
      this.handleCloseButtonClick();
    }
  }

  @action
  handleCloseButtonClick() {
    this.globalModalsService.closeModals();

    if (this.args.onClose) {
      this.args.onClose();
    }
  }
}
