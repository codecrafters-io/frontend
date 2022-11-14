import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class CommunitySolutionsLanguageDropdownComponent extends Component {
  @action
  handleLanguageDropdownLinkClick(language, closeDropdownFn) {
    closeDropdownFn();
    this.args.onRequestedLanguageChange(language);
  }

  get languages() {
    return this.args.courseStage.course.betaOrLiveLanguages.sortBy('name');
  }
}
