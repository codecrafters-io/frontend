import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class HeaderAccountDropdownComponent extends Component {
  @action
  handleDidInsert() {
    document.querySelector('body').classList.add('overflow-hidden');
  }

  @action
  handleWillDestroy() {
    document.querySelector('body').classList.remove('overflow-hidden');
  }
}
