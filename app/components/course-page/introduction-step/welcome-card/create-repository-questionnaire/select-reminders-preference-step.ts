import Component from '@glimmer/component';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import { action } from '@ember/object';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
  };
}

export default class SelectRemindersPreferenceStep extends Component<Signature> {
  @action
  async handleSelect(remindersAreEnabled: RepositoryModel['remindersAreEnabled']) {
    if (!this.args.repository.isSaving) {
      this.args.repository.remindersAreEnabled = remindersAreEnabled;

      await this.args.repository.save();
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::IntroductionStep::WelcomeCard::CreateRepositoryQuestionnaire::SelectRemindersPreferenceStep': typeof SelectRemindersPreferenceStep;
  }
}
