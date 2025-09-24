import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    selected?: boolean;
    name?: string;
    description?: string;
    onSelect: () => void;
  };
}

export default class PricingPlanOption extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TeamPaymentPage::TeamDetailsForm::PricingPlanOption': typeof PricingPlanOption;
  }
}
