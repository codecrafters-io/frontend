import Component from '@glimmer/component';
import LanguageModel from 'codecrafters-frontend/models/language';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    language: LanguageModel;
    onClick: () => void;
    isSelected: boolean;
    isEnabled: boolean;
    isRequested: boolean;
  };
}

export default class LanguageDropdownLinkComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    LanguageDropdownLink: typeof LanguageDropdownLinkComponent;
  }
}
