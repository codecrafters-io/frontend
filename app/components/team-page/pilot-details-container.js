import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import window from 'ember-window-mock';
import Component from '@glimmer/component';

export default class PilotDetailsContainerComponent extends Component {
  @service store;
  @tracked isCreatingPaymentMethodUpdateRequest = false;

  @action
  async handleAddPaymentMethodButtonClick() {
    this.isCreatingPaymentMethodUpdateRequest = true;
    const paymentMethodUpdateRequest = await this.store.createRecord('team-payment-method-update-request', { team: this.args.team }).save();
    window.location.href = paymentMethodUpdateRequest.url;
  }
}
