import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    title: string;
    description: string;
  };

  Blocks: {
    belowDescription: [];
    default: [];
  };
}

export default class FormSectionComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Settings::FormSection': typeof FormSectionComponent;
  }
}
