import Component from '@glimmer/component';

type RepositoryModel = {
  id: null | string;
  save(): Promise<void>;
};

type Signature = {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
  };
};

export default class SelectLanguageProficiencyLevelSectionComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::IntroductionStep::PreChallengeAssessmentCard::SelectLanguageProficiencyLevelSectionComponent': typeof SelectLanguageProficiencyLevelSectionComponent;
  }
}
