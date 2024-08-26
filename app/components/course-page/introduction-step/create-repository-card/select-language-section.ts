import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';
import rippleSpinnerImage from '/assets/images/icons/ripple-spinner.svg';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type Store from '@ember-data/store';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    errorMessage?: string;
    preferredLanguageSlug: string;
    repository: RepositoryModel;
    onLanguageSelection: (language: LanguageModel) => void;
  };
}

export default class SelectLanguageSectionComponent extends Component<Signature> {
  rippleSpinnerImage = rippleSpinnerImage;
  @service declare store: Store;
  requestedLanguagesPromptTransition = fade;
  @tracked shouldShowNonPreferredLanguages = false;

  get availableLanguages() {
    return this.args.repository.course.availableLanguageConfigurationsForUser(this.args.repository.user).mapBy('language');
  }

  get orderedLanguageConfigurations() {
    return this.args.repository.course.availableLanguageConfigurationsForUser(this.args.repository.user).sortBy('language.name');
  }

  get preferredLanguages() {
    return this.availableLanguages.filterBy('slug', this.args.preferredLanguageSlug);
  }

  get requestedAndUnsupportedLanguages() {
    return this.requestedLanguages.filter((language) => {
      return !this.availableLanguages.includes(language);
    });
  }

  get requestedLanguages() {
    return this.args.repository.user.courseLanguageRequests.filterBy('course', this.args.repository.course).mapBy('language');
  }

  @action
  handleLanguageButtonClick(language: LanguageModel) {
    this.args.onLanguageSelection(language);
  }

  @action
  handleShowOtherLanguagesButtonClick() {
    this.shouldShowNonPreferredLanguages = true;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::IntroductionStep::CreateRepositoryCard::SelectLanguageSection': typeof SelectLanguageSectionComponent;
  }
}
