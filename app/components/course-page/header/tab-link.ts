import Component from '@glimmer/component';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    route: string;
    models: string[];
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

export default class InstructionsCardComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::Header::TabLink': typeof InstructionsCardComponent;
  }
}
