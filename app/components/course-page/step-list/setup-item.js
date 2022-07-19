import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import fade from 'ember-animated/transitions/fade';

export default class CoursePageContentStepListSetupItemComponent extends Component {
  @tracked shouldShowUpgradePrompt = false;
  @service('current-user') currentUserService;
  @service store;
  transition = fade;

  @action
  async handleLanguageSelection(language) {
    this.args.repository.language = language;

    if (this.currentUserService.record.canCreateRepository(this.args.repository.course, language)) {
      this.shouldShowUpgradePrompt = false;
      await this.args.repository.save();
      this.args.onRepositoryCreate();
    } else {
      this.shouldShowUpgradePrompt = true;
    }
  }

  get isComplete() {
    return this.args.repository.firstSubmissionCreated;
  }
}
