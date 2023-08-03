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

export default class PrimaryLinkButtonComponent extends Component<Signature> {
  get sizeIsSmall(): boolean {
    return this.args.size === 'small';
  }

  get normalizedModels(): string[] {
    if (this.args.model) {
      return [this.args.model];
    } else if (this.args.models) {
      return this.args.models;
    } else {
      return [];
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    PrimaryLinkButton: typeof PrimaryLinkButtonComponent;
  }
}
