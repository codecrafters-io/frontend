import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class CourseStageSolutionPageLanguageDropdownComponent extends Component {
  @action
  handleLanguageDropdownLinkClick(language, closeDropdownFn) {
    closeDropdownFn();
    this.args.onRequestedLanguageChange(language);
  }

  get languagesWithSolutions() {
    return this.args.courseStage.solutions.mapBy('language').uniq().sortBy('name');
  }
}
