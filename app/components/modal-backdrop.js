import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ModalBackdropComponent extends Component {
  get containerElement() {
    return document.getElementById('modal-backdrop-container');
  }

  @action
  handleDidInsert() {
    document.querySelector('body').classList.add('overflow-hidden');
  }

  @action
  handleWillDestroy() {
    document.querySelector('body').classList.remove('overflow-hidden');
  }
}
