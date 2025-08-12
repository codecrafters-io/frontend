import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class CommunitySolutionsLanguageDropdown extends Component {
  get languages() {
    return this.args.courseStage.course.betaOrLiveLanguages.sortBy('name');
  }

  @action
  handleLanguageDropdownLinkClick(language, closeDropdownFn) {
    closeDropdownFn();
    this.args.onRequestedLanguageChange(language);
  }
}
