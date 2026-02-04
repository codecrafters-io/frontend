import Component from '@glimmer/component';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    link: string;
  };
}

export default class DiscussOnHnButton extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    DiscussOnHnButton: typeof DiscussOnHnButton;
  }
}
