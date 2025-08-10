import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    title: string;
  };

  Blocks: {
    default: [];
  };
}

export default class PageSection extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    PageSection: typeof PageSection;
  }
}
