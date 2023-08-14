import Component from '@glimmer/component';
import { TemporaryRepositoryModel } from 'codecrafters-frontend/models/temporary-types';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    isDisabled: boolean;
    repository: TemporaryRepositoryModel;
  };
};

export default class SelectRemindersPreferenceSectionComponent extends Component<Signature> {
  @tracked isSaving = false;

  @action
  async handleSelect(remindersAreEnabled: TemporaryRepositoryModel['remindersAreEnabled']) {
    if (!this.isSaving) {
      this.args.repository.remindersAreEnabled = remindersAreEnabled;

      this.isSaving = true;

      try {
        await this.args.repository.save();
      } finally {
        this.isSaving = false;
      }
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::IntroductionStep::CreateRepositoryCard::SelectRemindersPreferenceSection': typeof SelectRemindersPreferenceSectionComponent;
  }
}
