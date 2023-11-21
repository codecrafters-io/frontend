import Component from '@glimmer/component';

interface Signature {
  Element: HTMLElement;

  Args: {
    helpText: string;
    icon: string;
    title: string;
  };

  Blocks: {
    default: [];
  };
}

export default class ReferralLinkStatContainerComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ReferralsPage::ReferralLinkStatContainer': typeof ReferralLinkStatContainerComponent;
  }
}
