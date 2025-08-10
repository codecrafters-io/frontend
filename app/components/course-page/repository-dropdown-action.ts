import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    icon: string;
    isDisabled?: boolean;
  };

  Blocks: {
    default: [];
  };
}

export default class RepositoryDropdownAction extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::RepositoryDropdownAction': typeof RepositoryDropdownAction;
  }
}
