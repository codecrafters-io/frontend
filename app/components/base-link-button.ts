import Component from '@glimmer/component';
import { BaseButtonSignature } from './base-button';

export interface BaseLinkButtonSignature {
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

export default class BaseLinkButtonComponent extends Component<BaseLinkButtonSignature> {
  get sizeIsSmall(): boolean {
    return this.args.size === 'small';
  }

  get sizeIsExtraSmall(): boolean {
    return this.args.size === 'extra-small';
  }

  get sizeIsRegular(): boolean {
    return this.args.size === 'regular' || !this.args.size;
  }

  get normalizedModels(): string[] {
    if (this.args.model) {
      return [this.args.model];
    }

    if (this.args.models) {
      return this.args.models;
    }

    return [];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    BaseLinkButton: typeof BaseLinkButtonComponent;
  }
}
