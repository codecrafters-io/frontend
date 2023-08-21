import Component from '@glimmer/component';

export interface BaseButtonSignature {
  Element: HTMLButtonElement;

  Args: {
    size?: 'extra-small' | 'small' | 'regular' | 'large';
    isDisabled?: boolean;
  };

  Blocks: {
    default: [];
  };
}

export default class BaseButtonComponent extends Component<BaseButtonSignature> {
  get sizeIsSmall(): boolean {
    return this.args.size === 'small';
  }

  get sizeIsRegular(): boolean {
    return !this.args.size || this.args.size === 'regular';
  }

  get sizeIsExtraSmall(): boolean {
    return this.args.size === 'extra-small';
  }

  get sizeIsLarge(): boolean {
    return this.args.size === 'large';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    BaseButton: typeof BaseButtonComponent;
  }
}
