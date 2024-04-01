import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    isActive: boolean;
    iconUrl?: string;
    icon?: string;
    text: string;
  };

  Blocks: {
    content: [];
    footer: [];
  };
}

export default class TabLinkComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::Header::TabLink': typeof TabLinkComponent;
  }
}
