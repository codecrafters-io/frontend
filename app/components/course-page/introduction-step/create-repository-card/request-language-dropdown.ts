import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import Fuse from 'fuse.js';
import LanguageModel from 'codecrafters-frontend/models/language';
import Store from '@ember-data/store';
import UserModel from 'codecrafters-frontend/models/user';
import rippleSpinnerImage from '/assets/images/icons/ripple-spinner.svg';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    course: CourseModel;
    user: UserModel;
    onClose: () => void;
  };
}

export default class RequestLanguageDropdownComponent extends Component<Signature> {
  rippleSpinnerImage = rippleSpinnerImage;

  @service declare store: Store;

  @tracked inputElement!: HTMLInputElement;
  @tracked isSyncing = false;
  @tracked searchQuery = '';
  @tracked selectedSuggestionIndex = 0;
  @tracked suggestionListElement!: HTMLDivElement;

  get availableLanguages(): LanguageModel[] {
    return this.store
      .peekAll('language')
      .filter((language) => !this.args.course.betaOrLiveLanguages.includes(language))
      .sortBy('name');
  }

  get languageSuggestions() {
    const allSuggestions = this.availableLanguages.map((language) => {
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

  get requestedLanguages(): LanguageModel[] {
    return this.args.user.courseLanguageRequests.filterBy('course', this.args.course).mapBy('language');
  }

  @action
  handleArrowDown() {
    if (this.selectedSuggestionIndex < this.languageSuggestions.length - 1) {
      this.selectedSuggestionIndex += 1;
      this.suggestionListElement.children[this.selectedSuggestionIndex]!.scrollIntoView({ block: 'nearest' });
    }
  }

  @action
  handleArrowUp() {
    if (this.selectedSuggestionIndex > 0) {
      this.selectedSuggestionIndex -= 1;
      this.suggestionListElement.children[this.selectedSuggestionIndex]!.scrollIntoView({ block: 'nearest' });
    }
  }

  @action
  handleEnter() {
    const suggestion = this.languageSuggestions[this.selectedSuggestionIndex];

    if (suggestion) {
      this.toggleLanguageSelection(suggestion.language);
      this.searchQuery = '';
    }
  }

  @action
  handleInputDidInsert(element: HTMLInputElement) {
    this.inputElement = element;
    this.inputElement.focus();
  }

  @action
  handleSearchQueryChanged() {
    this.selectedSuggestionIndex = 0;
  }

  @action
  handleSuggestionListDidInsert(element: HTMLDivElement) {
    this.suggestionListElement = element;
  }

  @action
  async toggleLanguageSelection(language: LanguageModel) {
    if (this.requestedLanguages.includes(language)) {
      this.isSyncing = true;
      await this.args.user.courseLanguageRequests.filterBy('course', this.args.course).findBy('language', language)!.destroyRecord();
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
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::IntroductionStep::CreateRepositoryCard::RequestLanguageDropdown': typeof RequestLanguageDropdownComponent;
  }
}
