import { action } from '@ember/object';
import Component from '@glimmer/component';
import type { TemporaryLanguageModel } from 'codecrafters-frontend/lib/temporary-types';

interface DDActions {
  close: () => void;
}

interface Signature {
  Element: HTMLDivElement;

  Args: {
    languages: TemporaryLanguageModel[];
    requestedLanguage: TemporaryLanguageModel | null; // This is highlighted with an exclamation mark if it's not the selected one
    selectedLanguage: TemporaryLanguageModel | null;
    onDidInsertDropdown?: (dropdown: DDActions) => void;
    onRequestedLanguageChange: (language: TemporaryLanguageModel) => void;
  };
}

export default class LanguageDropdownComponent extends Component<Signature> {
  @action
  handleLanguageDropdownLinkClick(language: TemporaryLanguageModel, closeDropdownFn: () => void) {
    closeDropdownFn();
    this.args.onRequestedLanguageChange(language);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    LanguageDropdown: typeof LanguageDropdownComponent;
  }
}
