import Component from '@glimmer/component';
import Fuse from 'fuse.js';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import rippleSpinnerImage from '/assets/images/icons/ripple-spinner.svg';

export default class CoursePageContentStepListSetupItemRequestLanguageDropdownContentComponent extends Component {
  rippleSpinnerImage = rippleSpinnerImage;

  @tracked inputElement;
  @tracked isSyncing = false;
  @tracked searchQuery = '';
  @tracked selectedSuggestionIndex = 0;
  @service store;
  @tracked suggestionListElement;

  get availableLanguages() {
    return this.store
      .peekAll('language')
      .filter((language) => !this.args.course.betaOrLiveLanguages.includes(language))
      .sortBy('name');
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
  handleEnter() {
    if (this.languageSuggestions[this.selectedSuggestionIndex]) {
      this.toggleLanguageSelection(this.languageSuggestions[this.selectedSuggestionIndex].language);
      this.searchQuery = '';
    }
  }

  @action
  async toggleLanguageSelection(language) {
    if (this.requestedLanguages.includes(language)) {
      this.isSyncing = true;
      await this.args.user.courseLanguageRequests.filterBy('course', this.args.course).findBy('language', language).destroyRecord();
      this.isSyncing = false;

      this.inputElement.focus();
    } else {
      if (this.requestedLanguages.length === 0) {
        this.args.onClose(); // First selection
      } else {
        this.inputElement.focus();
      }

      this.isSyncing = true;
      await this.store.createRecord('course-language-request', { user: this.args.user, course: this.args.course, language: language }).save();
      this.isSyncing = false;
    }
  }

  get requestedLanguages() {
    return this.args.user.courseLanguageRequests.filterBy('course', this.args.course).mapBy('language');
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

  get languageSuggestions() {
    let allSuggestions = this.availableLanguages.map((language) => {
      return {
        isSelected: this.requestedLanguages.includes(language),
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
