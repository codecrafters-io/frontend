import Component from '@glimmer/component';
import { action } from '@ember/object';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    allowManualClose?: boolean;
    isWide?: boolean;
    onClose?: () => void;
    shouldHideCloseButton?: boolean;
  };

  Blocks: {
    default: [];
  };
};

export default class ModalBodyComponent extends Component<Signature> {
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

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    ModalBody: typeof ModalBodyComponent;
  }
}
