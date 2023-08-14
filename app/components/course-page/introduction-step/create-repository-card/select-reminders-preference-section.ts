import Component from '@glimmer/component';
import { action } from '@ember/object';

type RepositoryModel = {
  id: null | string;
  language: null | { name: string };
  expectedActivityFrequency: 'never_tried' | 'beginner' | 'intermediate' | 'advanced';
  save(): Promise<void>;
};

type Signature = {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
    onSelect: () => void;
  };
};

export default class SelectRemindersPreferenceSectionComponent extends Component<Signature> {
  @action
  async handleSelect(frequency: RepositoryModel['expectedActivityFrequency']) {
    this.args.repository.expectedActivityFrequency = frequency;
    this.args.repository.save(); // Saving can happen in the background, no need to await
    this.args.onSelect();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::IntroductionStep::CreateRepositoryCard::SelectRemindersPreferenceSection': typeof SelectRemindersPreferenceSectionComponent;
  }
}
