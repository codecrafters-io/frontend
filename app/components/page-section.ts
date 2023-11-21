import Component from '@glimmer/component';

interface Signature {
  Element: HTMLElement;

  Args: {
    title: string;
  };

  Blocks: {
    default: [];
  };
}

export default class PageSectionComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    PageSection: typeof PageSectionComponent;
  }
}
