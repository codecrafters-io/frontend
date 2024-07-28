import Component from '@glimmer/component';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type Store from '@ember-data/store';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLFormElement;

  Args: {
    withdrawableEarningsAmountInCents: number;
    onSubmit: () => void;
  };
}

export default class PaypalPayoutFormComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;
  @tracked emailAddress: string = '';
  @tracked formElement: HTMLFormElement | undefined;
  @tracked amountInDollars: number = 100;
  @tracked isCreatingPayout: boolean = false;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);

    this.amountInDollars = this.args.withdrawableEarningsAmountInCents / 100;
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get formIsComplete() {
    return this.emailAddress && this.emailAddress.trim() !== '' && this.amountInDollars;
  }

  get withdrawableEarningsAmountInDollars() {
    return this.args.withdrawableEarningsAmountInCents / 100;
  }

  @action
  async handleDidInsertFormElement(formElement: HTMLFormElement) {
    this.formElement = formElement;
  }

  @action
  async handleFormSubmit(e: SubmitEvent) {
    e.preventDefault();
    this.formElement!.reportValidity();

    if (this.formElement!.checkValidity()) {
      this.isCreatingPayout = true;

      await this.store
        .createRecord('affiliate-earnings-payout', {
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
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'AffiliatePage::CreatePayoutModal::PaypalPayoutForm': typeof PaypalPayoutFormComponent;
  }
}
