import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import fade from 'ember-animated/transitions/fade';

export default class RepositorySetupCardComponent extends Component {
  @service authenticator;
  @service coursePageState;
  @service store;
  @service router;

  @tracked shouldShowUpgradePrompt = false;
  transition = fade;

  @action
  async handleLanguageSelection(language) {
    this.args.repository.language = language;

    if (this.authenticator.currentUser.canCreateRepository(this.args.repository.course, language)) {
      this.shouldShowUpgradePrompt = false;
      await this.args.repository.save();
      this.router.transitionTo({ queryParams: { repo: this.args.repository.id, track: null } });
    } else {
      this.shouldShowUpgradePrompt = true;
    }
  }

  get isComplete() {
    return this.args.repository.firstSubmissionCreated;
  }
}
