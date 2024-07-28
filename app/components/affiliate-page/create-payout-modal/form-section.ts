import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    description: string;
    title: string;
  };

  Blocks: {
    default: [];
  };
}

export default class FormSectionComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'AffiliatePage::CreatePayoutModal::FormSection': typeof FormSectionComponent;
  }
}
