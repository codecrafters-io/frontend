import Component from '@glimmer/component';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import { action } from '@ember/object';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
  };
}

export default class SelectExpectedActivityFrequencyStep extends Component<Signature> {
  @action
  async handleSelect(frequency: RepositoryModel['expectedActivityFrequency']) {
    if (!this.args.repository.isSaving) {
      this.args.repository.expectedActivityFrequency = frequency;

      await this.args.repository.save();
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::IntroductionStep::WelcomeCard::CreateRepositoryQuestionnaire::SelectExpectedActivityFrequencyStep': typeof SelectExpectedActivityFrequencyStep;
  }
}
