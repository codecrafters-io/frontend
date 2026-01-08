import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    extraInvoiceDetailsRequested: boolean;
    onToggle: (value: boolean) => void;
  };
}

export default class ExtraInvoiceDetailsToggle extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'PayPage::ChooseMembershipPlanModal::ExtraInvoiceDetailsToggle': typeof ExtraInvoiceDetailsToggle;
  }
}
