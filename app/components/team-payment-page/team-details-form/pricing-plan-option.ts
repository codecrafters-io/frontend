import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    description: string;
    name: string;
    onSelect: (event: Event) => void;
    selected: boolean;
  };
}

export default class PricingPlanOption extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TeamPaymentPage::TeamDetailsForm::PricingPlanOption': typeof PricingPlanOption;
  }
}
