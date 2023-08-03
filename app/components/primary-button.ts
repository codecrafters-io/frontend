import Component from '@glimmer/component';
import { BaseButtonSignature } from './base-button';

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

export default class PrimaryButtonComponent extends Component<Signature> {
  get sizeIsSmall(): boolean {
    return this.args.size === 'small';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    PrimaryButton: typeof PrimaryButtonComponent;
  }
}
