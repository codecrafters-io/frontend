import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CoursePageContentStepListSetupItemComponent extends Component {
  @service store;

  @action
  handleLanguageButtonClick(language) {
    this.args.onLanguageSelection(language);
  }
}
