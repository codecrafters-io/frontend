import Component from '@glimmer/component';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    size?: 'small' | 'regular';
    isDisabled?: boolean;
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
