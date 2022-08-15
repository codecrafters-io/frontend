import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import window from 'ember-window-mock';

export default class ActionsSectionComponent extends Component {
  @tracked isCreatingPaymentMethodUpdateRequest = false;
  @service router;
  @service store;

  @action
  async handleStartMembershipButtonClick() {
    this.router.transitionTo('pay');
  }

  @action
  async handleUpdatePaymentMethodButtonClick() {
    this.isCreatingPaymentMethodUpdateRequest = true;
    const paymentMethodUpdateRequest = await this.store.createRecord('individual-payment-method-update-request').save();
    window.location.href = paymentMethodUpdateRequest.url;
  }
}
