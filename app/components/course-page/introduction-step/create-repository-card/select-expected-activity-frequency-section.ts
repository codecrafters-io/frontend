import Component from '@glimmer/component';
import { TemporaryRepositoryModel } from 'codecrafters-frontend/models/temporary-types';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    isDisabled: boolean;
    repository: TemporaryRepositoryModel;
    onSelect: () => void;
  };
};

export default class SelectExpectedActivityFrequencySectionComponent extends Component<Signature> {
  @tracked isSaving = false;

  @action
  async handleSelect(frequency: TemporaryRepositoryModel['expectedActivityFrequency']) {
    if (!this.isSaving) {
      this.args.repository.expectedActivityFrequency = frequency;

      this.isSaving = true;
      this.args.onSelect(); // Saving can happen in the background, no need to await

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
    'CoursePage::IntroductionStep::CreateRepositoryCard::SelectExpectedActivityFrequencySection': typeof SelectExpectedActivityFrequencySectionComponent;
  }
}
