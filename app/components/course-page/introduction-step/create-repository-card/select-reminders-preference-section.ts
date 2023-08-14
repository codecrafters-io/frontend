import Component from '@glimmer/component';
import { action } from '@ember/object';

type RepositoryModel = {
  id: null | string;
  language: null | { name: string };
  expectedActivityFrequency: 'never_tried' | 'beginner' | 'intermediate' | 'advanced';
  remindersAreEnabled: boolean;
  save(): Promise<void>;
};

type Signature = {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
  };
};

export default class SelectRemindersPreferenceSectionComponent extends Component<Signature> {
  @action
  async handleSelect(remindersAreEnabled: RepositoryModel['remindersAreEnabled']) {
    this.args.repository.remindersAreEnabled = remindersAreEnabled;
    await this.args.repository.save();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::IntroductionStep::CreateRepositoryCard::SelectRemindersPreferenceSection': typeof SelectRemindersPreferenceSectionComponent;
  }
}
