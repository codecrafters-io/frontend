import Component from '@glimmer/component';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    size: 'small' | 'regular';
    isDisabled?: boolean;
    shouldShowSpinner: boolean;
  };

  Blocks: {
    default: [];
  };
}

export default class PrimaryButtonWithSpinnerComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    PrimaryButtonWithSpinner: typeof PrimaryButtonWithSpinnerComponent;
  }
}
