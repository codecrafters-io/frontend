import Component from '@glimmer/component';
import type { BaseButtonSignature } from './base-button';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    size?: BaseButtonSignature['Args']['size'];
    isDisabled?: BaseButtonSignature['Args']['isDisabled'];
    shouldShowSpinner: boolean;
  };

  Blocks: {
    default: [];
  };
}

export default class PrimaryButtonWithSpinnerComponent extends Component<Signature> {
  get sizeIsExtraSmall(): boolean {
    return this.args.size === 'extra-small';
  }

  get sizeIsLarge(): boolean {
    return this.args.size === 'large';
  }

  get sizeIsRegular(): boolean {
    return !this.args.size || this.args.size === 'regular';
  }

  get sizeIsSmall(): boolean {
    return this.args.size === 'small';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    PrimaryButtonWithSpinner: typeof PrimaryButtonWithSpinnerComponent;
  }
}
