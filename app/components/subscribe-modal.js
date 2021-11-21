import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SubscribeModalComponent extends Component {
  @service('globalModals') globalModalsService;

  @action
  handleCloseButtonClick() {
    this.globalModalsService.closeModals();
  }
}
