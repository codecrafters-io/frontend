import Component from '@glimmer/component';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    shouldShowSpinner: boolean;
  };

  Blocks: {
    default: [];
  };
}

export default class ButtonWithSpinnerComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    ButtonWithSpinner: typeof ButtonWithSpinnerComponent;
  }
}
