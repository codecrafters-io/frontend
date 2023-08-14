import Component from '@glimmer/component';
import { TemporaryRepositoryModel } from 'codecrafters-frontend/models/temporary-types';
import { action } from '@ember/object';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    isDisabled: boolean;
    repository: TemporaryRepositoryModel;
  };
};

export default class SelectRemindersPreferenceSectionComponent extends Component<Signature> {
  @action
  async handleSelect(remindersAreEnabled: TemporaryRepositoryModel['remindersAreEnabled']) {
    if (!this.args.repository.isSaving) {
      this.args.repository.remindersAreEnabled = remindersAreEnabled;

      await this.args.repository.save();
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::IntroductionStep::CreateRepositoryCard::SelectRemindersPreferenceSection': typeof SelectRemindersPreferenceSectionComponent;
  }
}
