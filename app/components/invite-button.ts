import Component from '@glimmer/component';

export interface Signature {
  Element: HTMLDivElement;

  Args: {
    isCollapsed: boolean;
    onClick: () => void;
    text: string;
  };
}

export default class InviteButtonComponent extends Component<Signature> { }

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    InviteButton: typeof InviteButtonComponent;
  }
}
