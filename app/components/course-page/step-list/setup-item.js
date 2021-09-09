import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import fade from 'ember-animated/transitions/fade';

export default class CoursePageContentStepListSetupItemComponent extends Component {
  @service store;
  transition = fade;

  @action
  async handleLanguageSelection(language) {
    this.args.repository.language = language;
    await this.args.repository.save();
    this.args.onRepositoryCreate();
  }

  get isComplete() {
    return this.args.repository.firstSubmissionCreated;
  }
}
