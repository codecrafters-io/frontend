import Component from '@glimmer/component';

interface User {
  username: string;
  id?: string;
  isVip?: boolean;
}

interface Signature {
  Element: HTMLDivElement;

  Args: {
    user: User;
  };
}

export default class SupportSectionComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Settings::BillingPage::SupportSection': typeof SupportSectionComponent;
  }
}
