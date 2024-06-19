import Component from '@glimmer/component';
import { type BaseButtonSignature } from './base-button';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    size?: BaseButtonSignature['Args']['size'];
    isDisabled?: BaseButtonSignature['Args']['isDisabled'];
    shouldOpenInNewTab?: boolean;
    route: string;
    model?: string;
    models?: string[];
    query?: Record<string, null | string>;
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
