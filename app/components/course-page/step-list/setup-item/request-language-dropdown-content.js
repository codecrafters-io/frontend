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
    return this.store.peekAll('language').reject((language) => {
      return this.selectedLanguages.includes(language);
    });
  }

  @action
  handleArrowDown() {
    if (this.selectedSuggestionIndex < this.suggestedLanguages.length - 1) {
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
    this.handleLanguageSelection(this.suggestedLanguages[this.selectedSuggestionIndex]);
  }

  @action
  handleLanguageSelection(language) {
    this.selectedLanguages.pushObject(language);
    this.inputElement.focus();
    this.searchQuery = '';
    this.selectedSuggestionIndex = 0;
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
  handleSuggestionListDidInsert(element) {
    this.suggestionListElement = element;
  }

  get suggestedLanguages() {
    if (this.searchQuery.length > 0) {
      return new Fuse(this.availableLanguages.toArray(), { keys: ['name'] }).search(this.searchQuery).mapBy('item');
    } else {
      return this.availableLanguages;
    }
  }
}
