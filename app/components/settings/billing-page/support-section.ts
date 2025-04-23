import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    username: string;
  };
}

export default class SupportSectionComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Settings::BillingPage::SupportSection': typeof SupportSectionComponent;
  }
} 