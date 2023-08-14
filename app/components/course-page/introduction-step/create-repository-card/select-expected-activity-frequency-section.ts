import Component from '@glimmer/component';
import { action } from '@ember/object';
import { TemporaryRepositoryModel } from 'codecrafters-frontend/models/temporary-types';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    isDisabled: boolean;
    repository: TemporaryRepositoryModel;
    onSelect: () => void;
  };
};

export default class SelectExpectedActivityFrequencySectionComponent extends Component<Signature> {
  @action
  async handleSelect(frequency: TemporaryRepositoryModel['expectedActivityFrequency']) {
    this.args.repository.expectedActivityFrequency = frequency;
    this.args.repository.save(); // Saving can happen in the background, no need to await
    this.args.onSelect();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::IntroductionStep::CreateRepositoryCard::SelectExpectedActivityFrequencySection': typeof SelectExpectedActivityFrequencySectionComponent;
  }
}
