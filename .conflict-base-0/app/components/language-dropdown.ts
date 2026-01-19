import { action } from '@ember/object';
import { htmlSafe, type SafeString } from '@ember/template';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
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
  @tracked shadowOverlayStyle: SafeString = htmlSafe('opacity: 1');

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
  handleDropdownContentScroll(event: Event) {
    const target = event.target as HTMLElement;
    const remainingScrollHeight = target.scrollHeight - target.scrollTop - target.clientHeight;
    const overlay = target.querySelector('shadow-overlay') as HTMLElement;
    const overlayHeight = overlay.clientHeight;
    const overlayOpacity = remainingScrollHeight < overlayHeight ? Math.max(0, remainingScrollHeight / overlayHeight) : 1;

    this.shadowOverlayStyle = htmlSafe(`opacity: ${isNaN(overlayOpacity) ? 1 : overlayOpacity}`);
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
