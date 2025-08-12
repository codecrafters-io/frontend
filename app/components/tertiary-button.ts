import Component from '@glimmer/component';
import { type BaseButtonSignature } from './base-button';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    size?: BaseButtonSignature['Args']['size'];
    isDisabled?: BaseButtonSignature['Args']['isDisabled'];
  };

  Blocks: {
    default: [];
  };
}

export default class TertiaryButton extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    TertiaryButton: typeof TertiaryButton;
  }
}
