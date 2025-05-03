import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;
  Args: {
    variant: 'teal' | 'red' | 'yellow';
  };
  Blocks: {
    default: [];
  };
}

export default class StatusPillComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Settings::BillingPage::MembershipSection::StatusPill': typeof StatusPillComponent;
  }
}
