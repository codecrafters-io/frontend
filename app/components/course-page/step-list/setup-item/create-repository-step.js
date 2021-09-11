import Component from '@glimmer/component';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';
import showdown from 'showdown';

export default class CoursePageContentStepListSetupItemCreateRepositoryStepComponent extends Component {
  @service store;

  @action
  handleLanguageButtonClick(language) {
    this.args.onLanguageSelection(language);
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
}
