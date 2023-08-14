import Component from '@glimmer/component';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import fade from 'ember-animated/transitions/fade';
import showdown from 'showdown';
import rippleSpinnerImage from '/assets/images/icons/ripple-spinner.svg';

export default class CreateRepositoryStepComponent extends Component {
  rippleSpinnerImage = rippleSpinnerImage;
  @service store;
  requestedLanguagesPromptTransition = fade;
  @tracked shouldShowNonPreferredLanguages = false;

  get courseDescriptionHTML() {
    return htmlSafe(new showdown.Converter().makeHtml(this.args.repository.course.descriptionMarkdown));
  }

  @action
  handleLanguageButtonClick(language) {
    this.args.onLanguageSelection(language);
  }

  @action
  handleShowOtherLanguagesButtonClick() {
    this.shouldShowNonPreferredLanguages = true;
  }

  get availableLanguages() {
    return this.args.repository.course.availableLanguageConfigurationsForUser(this.args.repository.user).mapBy('language');
  }

  get orderedLanguageConfigurations() {
    return this.args.repository.course.availableLanguageConfigurationsForUser(this.args.repository.user).sortBy('language.name');
  }

  get preferredLanguages() {
    return this.availableLanguages.filterBy('slug', this.args.preferredLanguageSlug);
  }

  get requestedLanguages() {
    return this.args.repository.user.courseLanguageRequests.filterBy('course', this.args.repository.course).mapBy('language');
  }

  get requestedAndUnsupportedLanguages() {
    return this.requestedLanguages.filter((language) => {
      return !this.availableLanguages.includes(language);
    });
  }
}
