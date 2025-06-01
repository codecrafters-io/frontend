import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    icon: string;
    text: string;
  };
}

export default class DropdownLinkComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    DropdownLink: typeof DropdownLinkComponent;
  }
}
