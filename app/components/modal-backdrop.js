import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class HeaderAccountDropdownComponent extends Component {
  @service('globalModals') globalModalsService;

  @action
  handleClickOutside() {
    this.globalModalsService.closeModals();
  }
}
