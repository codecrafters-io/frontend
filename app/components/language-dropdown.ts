import { action } from '@ember/object';
import Component from '@glimmer/component';
import LanguageModel from 'codecrafters-frontend/models/language';

interface DDActions {
  close: () => void;
}

interface Signature {
  Element: HTMLDivElement;

  Args: {
    languages: LanguageModel[];
    requestedLanguage: LanguageModel | null; // This is highlighted with an exclamation mark if it's not the selected one
    selectedLanguage: LanguageModel | null;
    onDidInsertDropdown?: (dropdown: DDActions) => void;
    onRequestedLanguageChange: (language: LanguageModel) => void;
  };
}

export default class LanguageDropdownComponent extends Component<Signature> {
  @action
  handleLanguageDropdownLinkClick(language: LanguageModel, closeDropdownFn: () => void) {
    closeDropdownFn();
    this.args.onRequestedLanguageChange(language);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    LanguageDropdown: typeof LanguageDropdownComponent;
  }
}
