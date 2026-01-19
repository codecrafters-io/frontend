import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    title: string;
    description: string;
  };

  Blocks: {
    default: [];
  };
}

export default class Section extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'GiftPaymentPage::GiftDetailsForm::Section': typeof Section;
  }
}
