import Component from '@glimmer/component';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import { action } from '@ember/object';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    isDisabled: boolean;
    repository: RepositoryModel;
    onSelect: () => void;
  };
};

export default class SelectExpectedActivityFrequencySectionComponent extends Component<Signature> {
  @action
  async handleSelect(frequency: RepositoryModel['expectedActivityFrequency']) {
    if (!this.args.repository.isSaving) {
      this.args.repository.expectedActivityFrequency = frequency;
      this.args.onSelect(); // Saving can happen in the background, no need to await

      await this.args.repository.save();
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::IntroductionStep::CreateRepositoryCard::SelectExpectedActivityFrequencySection': typeof SelectExpectedActivityFrequencySectionComponent;
  }
}
