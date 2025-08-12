import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onClick: () => void;
    isSelected: boolean;
  };
}

export default class AllLanguagesDropdownLink extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    AllLanguagesDropdownLink: typeof AllLanguagesDropdownLink;
  }
}
