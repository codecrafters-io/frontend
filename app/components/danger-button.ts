import Component from '@glimmer/component';
import type { BaseButtonSignature } from './base-button';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    isDisabled?: boolean;
    size?: BaseButtonSignature['Args']['size'];
  };

  Blocks: {
    default: [];
  };
}

export default class DangerButton extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    DangerButton: typeof DangerButton;
  }
}
