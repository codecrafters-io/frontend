import Component from '@glimmer/component';

export interface Signature {
  Element: HTMLButtonElement;

  Args: {
    isSelected: boolean;
  };

  Blocks: { default: [] };
}

export default class DarkModeToggleOptionComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    DarkModeToggleOption: typeof DarkModeToggleOptionComponent;
  }
}
