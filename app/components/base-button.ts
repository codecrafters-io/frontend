import Component from '@glimmer/component';

export interface BaseButtonSignature {
  Element: HTMLButtonElement;

  Args: {
    size?: 'small' | 'regular';
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
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    BaseButton: typeof BaseButtonComponent;
  }
}
