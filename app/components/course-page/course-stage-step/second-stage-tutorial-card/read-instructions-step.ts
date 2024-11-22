import Component from '@glimmer/component';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
    courseStage: CourseStageModel;
    isComplete: boolean;
    shouldRecommendLanguageGuide: boolean;
  };
}

export default class ReadInstructionsStepComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::SecondStageTutorialCard::ReadInstructionsStep': typeof ReadInstructionsStepComponent;
  }
}
