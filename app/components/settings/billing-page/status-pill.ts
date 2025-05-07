import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;
  Args: {
    color: 'teal' | 'red' | 'yellow' | 'gray';
  };
  Blocks: {
    default: [];
  };
}

export default class StatusPillComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Settings::BillingPage::StatusPill': typeof StatusPillComponent;
  }
} 