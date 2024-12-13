import Component from '@glimmer/component';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import { action } from '@ember/object';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    isDisabled: boolean;
    repository: RepositoryModel;
  };
}

export default class SelectRemindersPreferenceSectionComponent extends Component<Signature> {
  @action
  async handleSelect(remindersAreEnabled: RepositoryModel['remindersAreEnabled']) {
    if (this.args.isDisabled) {
      return;
    }

    if (!this.args.repository.isSaving) {
      this.args.repository.remindersAreEnabled = remindersAreEnabled;

      await this.args.repository.save();
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::IntroductionStep::Legacy::CreateRepositoryCard::SelectRemindersPreferenceSection': typeof SelectRemindersPreferenceSectionComponent;
  }
}
