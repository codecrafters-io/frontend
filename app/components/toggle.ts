import Component from '@glimmer/component';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    isDisabled?: boolean;
    isOn: boolean;
  };
}

export default class ToggleComponent extends Component<Signature> {
  get isOff(): boolean {
    return !this.args.isOn;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    Toggle: typeof ToggleComponent;
  }
}
