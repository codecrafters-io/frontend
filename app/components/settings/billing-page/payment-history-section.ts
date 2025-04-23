import Component from '@glimmer/component';
import type ChargeModel from 'codecrafters-frontend/models/charge';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    charges: ChargeModel[];
  };
}

export default class PaymentHistorySectionComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Settings::BillingPage::PaymentHistorySection': typeof PaymentHistorySectionComponent;
  }
} 