import Component from '@glimmer/component';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    isDisabled?: boolean;
    size?: string;
  };

  Blocks: {
    default: [];
  };
}

export default class DangerButton extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    DangerButton: typeof DangerButton;
  }
}
