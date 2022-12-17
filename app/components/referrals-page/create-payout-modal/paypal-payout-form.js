import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class PaypalPayoutFormComponent extends Component {
  @service('current-user') currentUserService;
  @service store;
  @tracked emailAddress = '';
  @tracked formElement;
  @tracked amountInDollars = 100;
  @tracked isCreatingPayout = false;

  constructor() {
    super(...arguments);

    this.amountInDollars = this.args.withdrawableEarningsAmountInCents / 100;
  }

  get currentUser() {
    return this.currentUserService.record;
  }

  get formIsComplete() {
    return this.emailAddress && this.emailAddress.trim() !== '' && this.amountInDollars;
  }

  @action
  async handleFormSubmit(e) {
    e.preventDefault();
    this.formElement.reportValidity();

    console.log('hey');

    if (this.formElement.checkValidity()) {
      this.isCreatingPayout = true;

      await this.store
        .createRecord('referral-earnings-payout', {
          user: this.currentUser,
          amountInCents: this.amountInDollars * 100,
          payoutMethodType: 'paypal',
          payoutMethodArgs: { email_address: this.emailAddress },
        })
        .save();

      this.isCreatingPayout = false;
      this.args.onSubmit();
    }
  }

  @action
  async handleDidInsertFormElement(formElement) {
    this.formElement = formElement;
  }

  get withdrawableEarningsAmountInDollars() {
    return this.args.withdrawableEarningsAmountInCents / 100;
  }
}
