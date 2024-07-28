import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    imageUrl: string;
    isDisabled?: boolean;
    isSelected: boolean;
    name: string;
  };
}

export default class PayoutMethodCardComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'AffiliatePage::CreatePayoutModal::PayoutMethodCard': typeof PayoutMethodCardComponent;
  }
}
