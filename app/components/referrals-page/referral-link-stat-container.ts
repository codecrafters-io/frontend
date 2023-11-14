import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    helpText: string;
    icon: string;
    title: string;
  };
}

export default class ReferralLinkStatContainerComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    ReferralLinkStatContainer: typeof ReferralLinkStatContainerComponent;
  }
}
