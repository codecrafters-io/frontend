import Component from '@glimmer/component';
import { BaseButtonSignature } from './base-button';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    size?: BaseButtonSignature['Args']['size'];
    isDisabled?: BaseButtonSignature['Args']['isDisabled'];
    isDark?: boolean;
  };

  Blocks: {
    default: [];
  };
}

export default class TertiaryButtonComponent extends Component<Signature> {
  get sizeIsSmall(): boolean {
    return this.args.size === 'small';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    TertiaryButton: typeof TertiaryButtonComponent;
  }
}
