import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import moment from 'moment';
import Component from '@glimmer/component';
import window from 'ember-window-mock';

export default class ActionsSectionComponent extends Component {
  @tracked isCancellingSubscription = false;
  @tracked isCancellingTrial = false;
  @tracked isCreatingPaymentMethodUpdateRequest = false;
  @service router;
  @service store;

  @action
  async handleCancelSubscriptionButtonClick() {
    if (
      window.confirm(
        `Your access will remain intact until ${moment(this.args.subscription.currentPeriodEnd).format(
          'LLL'
        )}, after which your membership will be cancelled. Are you sure?`
      )
    ) {
      this.isCancellingSubscription = true;
      await this.args.subscription.cancel();
      this.isCancellingSubscription = false;
    }
  }

  @action
  async handleCancelTrialButtonClick() {
    if (window.confirm(`Are you sure you want to cancel your trial?`)) {
      this.isCancellingTrial = true;
      await this.args.subscription.cancelTrial();
      this.isCancellingTrial = false;
    }
  }

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
