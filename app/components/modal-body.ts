import Component from '@glimmer/component';
import { action } from '@ember/object';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    shouldCloseOnOutsideClick: boolean;
    shouldShowCloseButton: boolean;
    onClose?: () => void;
  };

  Blocks: {
    default: [];
  };
}

export default class ModalBody extends Component<Signature> {
  @action
  handleClickOutside() {
    if (this.args.shouldCloseOnOutsideClick) {
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

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    ModalBody: typeof ModalBody;
  }
}
