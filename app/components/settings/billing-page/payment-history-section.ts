import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import * as Sentry from '@sentry/ember';
import rippleSpinnerImage from '/assets/images/icons/ripple-spinner.svg';
import type Store from '@ember-data/store';
import type UserModel from 'codecrafters-frontend/models/user';
import type ChargeModel from 'codecrafters-frontend/models/charge';

interface Signature {
  Element: HTMLDivElement;
  Args: {
    user: UserModel;
  };
}

export default class PaymentHistorySectionComponent extends Component<Signature> {
  @service declare store: Store;

  rippleSpinnerImage = rippleSpinnerImage;
  @tracked charges: ChargeModel[] = [];
  @tracked errorMessage: string | null = null;
  @tracked isLoading = true;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);
    this.loadCharges();
  }

  async loadCharges() {
    this.isLoading = true;
    this.errorMessage = null;

    try {
      const result = await this.store.query('charge', {
        filter: { user_id: this.args.user.id },
      });
      this.charges = result.toArray();
    } catch (error) {
      console.error('Failed to fetch charges:', error);
      this.errorMessage = 'Failed to load payment history. Please contact us at hello@codecrafters.io if this error persists.';
      Sentry.captureException(error);
      this.charges = [];
    } finally {
      this.isLoading = false;
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Settings::BillingPage::PaymentHistorySection': typeof PaymentHistorySectionComponent;
  }
}
