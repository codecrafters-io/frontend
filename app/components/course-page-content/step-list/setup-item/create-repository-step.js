import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CoursePageContentStepListSetupItemCreateRepositoryStepComponent extends Component {
  @service store;
  @tracked isCreatingRepository;

  @action
  handleLanguageButtonClick(language) {
    this.isCreatingRepository = true;
    this.args.onLanguageSelection(language);
  }
}
