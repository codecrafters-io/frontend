import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import fade from 'ember-animated/transitions/fade';
import rippleSpinnerImage from '/assets/images/icons/ripple-spinner.svg';

export default class SelectLanguageSectionComponent extends Component {
  rippleSpinnerImage = rippleSpinnerImage;
  @service store;
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
  handleLanguageButtonClick(language) {
    this.args.onLanguageSelection(language);
  }

  @action
  handleShowOtherLanguagesButtonClick() {
    this.shouldShowNonPreferredLanguages = true;
  }
}
