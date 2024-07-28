import Component from '@glimmer/component';

interface Signature {
  Element: HTMLTableRowElement;

  Args: {
    amountInDollars: number;
    helpText: string;
    isLoading: boolean;
    title: string;
  };
}

export default class LineItemComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'AffiliatePage::EarningsContainer::LineItem': typeof LineItemComponent;
  }
}
