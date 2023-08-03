import Component from '@glimmer/component';
import { BaseButtonSignature } from './base-button';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    size?: BaseButtonSignature['Args']['size'];
    isDisabled?: BaseButtonSignature['Args']['isDisabled'];
    isDark?: boolean;
    shouldShowSpinner?: boolean;
  };

  Blocks: {
    default: [];
  };
}

export default class TertiaryButtonWithSpinnerComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    TertiaryButtonWithSpinner: typeof TertiaryButtonWithSpinnerComponent;
  }
}
