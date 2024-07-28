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

export default class AffiliateLinkStatContainerComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'AffiliatePage::AffiliateLinkStatContainer': typeof AffiliateLinkStatContainerComponent;
  }
}
