import Component from '@glimmer/component';
import { action } from '@ember/object';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';

export default class CommunitySolutionsLanguageDropdown extends Component {
  get languages() {
    return this.args.courseStage.course.betaOrLiveLanguages.toSorted(fieldComparator('name'));
  }

  @action
  handleLanguageDropdownLinkClick(language, closeDropdownFn) {
    closeDropdownFn();
    this.args.onRequestedLanguageChange(language);
  }
}
