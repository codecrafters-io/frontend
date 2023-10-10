import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    title: string;
    description?: string;
  };

  Blocks: {
    description: [];
    content: [];
  };
}

export default class BasicDetailsSectionComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptAdmin::FormSection': typeof BasicDetailsSectionComponent;
  }
}
