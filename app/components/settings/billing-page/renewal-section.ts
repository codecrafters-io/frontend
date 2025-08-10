import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;
}

export default class RenewalSection extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Settings::BillingPage::RenewalSection': typeof RenewalSection;
  }
}
