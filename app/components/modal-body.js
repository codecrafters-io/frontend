import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ModalBodyComponent extends Component {
  @action
  handleClickOutside() {
    if (this.args.allowManualClose) {
      this.handleCloseButtonClick();
    }
  }

  @action
  handleCloseButtonClick() {
    if (this.args.onClose) {
      this.args.onClose();
    }
  }
}
