import Component from '@glimmer/component';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    isDisabled?: boolean;
    isOn: boolean;
    size?: 'small' | 'regular';
  };
}

export default class ToggleComponent extends Component<Signature> {
  get isOff(): boolean {
    return !this.args.isOn;
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
    Toggle: typeof ToggleComponent;
  }
}
