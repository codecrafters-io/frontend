import Component from '@glimmer/component';
import { action } from '@ember/object';

type Signature = {
  Element: HTMLDivElement;

  Blocks: {
    default: [];
  };
};

export default class ModalBackdropComponent extends Component<Signature> {
  get containerElement() {
    return document.getElementById('modal-backdrop-container') as HTMLDivElement;
  }

  @action
  handleDidInsert() {
    (document.querySelector('body') as HTMLBodyElement).classList.add('overflow-hidden');
  }

  @action
  handleWillDestroy() {
    (document.querySelector('body') as HTMLBodyElement).classList.remove('overflow-hidden');
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    ModalBackdrop: typeof ModalBackdropComponent;
  }
}
