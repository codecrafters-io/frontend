import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    description?: string;
    title: string;
  };

  Blocks: {
    content: [];
    description: [];
  };
}

export default class FormSection extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptAdmin::FormSection': typeof FormSection;
  }
}
