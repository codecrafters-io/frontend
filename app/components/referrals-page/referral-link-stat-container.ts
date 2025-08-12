import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    helpText: string;
    icon: string;
    title: string;
  };

  Blocks: {
    default: [];
  };
}

export default class ReferralLinkStatContainer extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ReferralsPage::ReferralLinkStatContainer': typeof ReferralLinkStatContainer;
  }
}
