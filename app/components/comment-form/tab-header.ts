import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;
  Args: {
    isActive: boolean;
    text: string;
  };
}

export default class TabHeader extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CommentForm::TabHeader': typeof TabHeader;
  }
}
