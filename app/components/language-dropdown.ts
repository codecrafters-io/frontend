import { action } from '@ember/object';
import Component from '@glimmer/component';
import LanguageModel from 'codecrafters-frontend/models/language';
import type { Dropdown } from 'ember-basic-dropdown/components/basic-dropdown';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    languages: LanguageModel[];
    requestedLanguage: LanguageModel | null; // This is highlighted with an exclamation mark if it's not the selected one
    selectedLanguage: LanguageModel | null;
    shouldShowAllLanguagesOption?: boolean;
    onAllLanguagesDropdownLinkClick?: () => void;
    onDidInsertDropdown?: (dropdown: Dropdown | null) => void;
    onRequestedLanguageChange: (language: LanguageModel) => void;
  };
}

export default class LanguageDropdown extends Component<Signature> {
  get isAllLanguagesOptionSelected() {
    return !this.args.selectedLanguage;
  }

  @action
  handleAllLanguagesDropdownLinkClick(closeDropdownFn: () => void) {
    closeDropdownFn();

    if (this.args.onAllLanguagesDropdownLinkClick) {
      this.args.onAllLanguagesDropdownLinkClick();
    }
  }

  @action
  handleLanguageDropdownLinkClick(language: LanguageModel, closeDropdownFn: () => void) {
    closeDropdownFn();
    this.args.onRequestedLanguageChange(language);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    LanguageDropdown: typeof LanguageDropdown;
  }
}
