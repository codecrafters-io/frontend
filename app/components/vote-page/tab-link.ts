import Component from '@glimmer/component';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    isActive: boolean;
    route: string;
    text: string;
  };
}

export default class TabLinkComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'VotePage::TabLink': typeof TabLinkComponent;
  }
}
