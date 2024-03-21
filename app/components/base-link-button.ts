import Component from '@glimmer/component';
import { type BaseButtonSignature } from './base-button';

export interface BaseLinkButtonSignature {
  Element: HTMLAnchorElement;

  Args: {
    size?: BaseButtonSignature['Args']['size'];
    isDisabled?: BaseButtonSignature['Args']['isDisabled'];
    route: string;
    model?: string;
    models?: string[];
    query?: Record<string, null | string>;
    shouldOpenInNewTab?: boolean;
  };

  Blocks: {
    default: [];
  };
}

export default class BaseLinkButtonComponent extends Component<BaseLinkButtonSignature> {
  get normalizedModels(): string[] {
    if (this.args.model) {
      return [this.args.model];
    }

    if (this.args.models) {
      return this.args.models;
    }

    return [];
  }

  get query() {
    return this.args.query || {};
  }

  get sizeIsExtraSmall(): boolean {
    return this.args.size === 'extra-small';
  }

  get sizeIsLarge(): boolean {
    return this.args.size === 'large';
  }

  get sizeIsRegular(): boolean {
    return this.args.size === 'regular' || !this.args.size;
  }

  get sizeIsSmall(): boolean {
    return this.args.size === 'small';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    BaseLinkButton: typeof BaseLinkButtonComponent;
  }
}
