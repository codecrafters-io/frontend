import Component from '@glimmer/component';
import { BaseButtonSignature } from './base-button';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    size?: BaseButtonSignature['Args']['size'];
    isDisabled?: BaseButtonSignature['Args']['isDisabled'];
    route: string;
    model?: string;
    models?: string[];
  };

  Blocks: {
    default: [];
  };
}

export default class TertiaryLinkButtonComponent extends Component<Signature> {
  get sizeIsSmall(): boolean {
    return this.args.size === 'small';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    TertiaryLinkButton: typeof TertiaryLinkButtonComponent;
  }
}
