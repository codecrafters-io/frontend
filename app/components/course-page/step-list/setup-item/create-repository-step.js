import Component from '@glimmer/component';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import fade from 'ember-animated/transitions/fade';
import showdown from 'showdown';

export default class CoursePageContentStepListSetupItemCreateRepositoryStepComponent extends Component {
  @service store;
  requestedLanguagesPromptTransition = fade;
  @tracked shouldShowNonPreferredLanguages = false;

  @action
  handleLanguageButtonClick(language) {
    this.args.onLanguageSelection(language);
  }

  @action
  handleShowOtherLanguagesButtonClick() {
    this.shouldShowNonPreferredLanguages = true;
  }

  get instructionsHTML() {
    return htmlSafe(new showdown.Converter().makeHtml(this.instructionsMarkdown));
  }

  get instructionsMarkdown() {
    return `
Welcome to the ${this.args.repository.course.name} challenge!

${this.args.repository.course.descriptionMarkdown}

To get started, let us know what language you'd like to attempt this challenge in...
    `;
  }

  get orderedLanguages() {
    return this.args.repository.course.supportedLanguages.sortBy('name');
  }

  get preferredLanguages() {
    return this.args.repository.course.supportedLanguages.filterBy('slug', this.args.preferredLanguageSlug);
  }

  get requestedLanguages() {
    return this.args.repository.user.courseLanguageRequests.filterBy('course', this.args.repository.course).mapBy('language');
  }

  get requestedAndUnsupportedLanguages() {
    return this.requestedLanguages.filter((language) => {
      return !this.args.repository.course.supportedLanguages.includes(language);
    });
  }
}
