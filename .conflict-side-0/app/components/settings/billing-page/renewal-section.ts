import Component from '@glimmer/component';
import type SubscriptionModel from 'codecrafters-frontend/models/subscription';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onExtendMembershipButtonClick: () => void;
    subscription: SubscriptionModel;
  };
}

export default class RenewalSection extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Settings::BillingPage::RenewalSection': typeof RenewalSection;
  }
}
