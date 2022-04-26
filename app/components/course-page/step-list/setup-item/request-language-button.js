import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class CoursePageContentStepListSetupItemRequestLanguageButtonComponent extends Component {
  @tracked shouldShowLanguageSelectionDropdown = false;

  @action
  handleButtonClick() {
    this.shouldShowLanguageSelectionDropdown = !this.shouldShowLanguageSelectionDropdown;
  }
}
