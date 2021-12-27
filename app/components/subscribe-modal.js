import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import window from 'ember-window-mock';

export default class SubscribeModalComponent extends Component {
  @tracked isCreatingCheckoutSession = false;
  @service('globalModals') globalModalsService;
  @service store;

  @action
  handleCloseButtonClick() {
    this.globalModalsService.closeModals();
  }

  @action
  async handleSubscribeButtonClick() {
    this.isCreatingCheckoutSession = true;
    let checkoutSession = this.store.createRecord('checkout-session');
    await checkoutSession.save();
    window.location.href = checkoutSession.url;
  }
}
