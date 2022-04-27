import Component from '@glimmer/component';
import Fuse from 'fuse.js';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CoursePageContentStepListSetupItemRequestLanguageDropdownContentComponent extends Component {
  @tracked inputElement;
  @tracked searchQuery = '';
  @tracked selectedLanguages = [];
  @tracked selectedSuggestionIndex = 0;
  @service store;
  @tracked suggestionListElement;

  get availableLanguages() {
    return this.store.peekAll('language').filter((language) => !this.args.course.supportedLanguages.includes(language));
  }

  @action
  handleArrowDown() {
    if (this.selectedSuggestionIndex < this.languageSuggestions.length - 1) {
      this.selectedSuggestionIndex += 1;
      this.suggestionListElement.children[this.selectedSuggestionIndex].scrollIntoView({ block: 'nearest' });
    }
  }

  @action
  handleArrowUp() {
    if (this.selectedSuggestionIndex > 0) {
      this.selectedSuggestionIndex -= 1;
      this.suggestionListElement.children[this.selectedSuggestionIndex].scrollIntoView({ block: 'nearest' });
    }
  }

  @action
  handleBackspace() {
    if (this.searchQuery.length === 0) {
      this.selectedLanguages.popObject();
      this.selectedSuggestionIndex = 0;
    }
  }

  @action
  handleEnter() {
    this.toggleLanguageSelection(this.languageSuggestions[this.selectedSuggestionIndex].language);
    this.searchQuery = '';
  }

  @action
  toggleLanguageSelection(language) {
    if (this.selectedLanguages.includes(language)) {
      this.selectedLanguages.removeObject(language);
      this.inputElement.focus();
    } else {
      this.selectedLanguages.pushObject(language);
      this.inputElement.focus();

      if (this.selectedLanguages.length === 1) {
        this.args.onClose();
      }
    }
  }

  @action
  handleInputDidInsert(element) {
    this.inputElement = element;
    this.inputElement.focus();
  }

  @action
  handleSearchQueryChanged() {
    this.selectedSuggestionIndex = 0;
  }

  @action
  handleSelectedLanguageRemoved(language) {
    this.selectedLanguages.removeObject(language);
  }

  @action
  handleSuggestionListDidInsert(element) {
    this.suggestionListElement = element;
  }

  get languageSuggestions() {
    let allSuggestions = this.availableLanguages.map((language) => {
      return {
        isSelected: this.selectedLanguages.includes(language),
        language: language,
      };
    });

    if (this.searchQuery.length > 0) {
      return new Fuse(allSuggestions, { keys: ['language.name'] }).search(this.searchQuery).mapBy('item');
    } else {
      return allSuggestions;
    }
  }
}
