import Component from '@glimmer/component';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type RepositoryModel from 'codecrafters-frontend/models/repository';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    isComplete: boolean;
    courseStage: CourseStageModel;
    repository: RepositoryModel;
  };
}

export default class MarkStageAsCompleteStepComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::FirstStageInstructionsCard::MarkStageAsCompleteStep': typeof MarkStageAsCompleteStepComponent;
  }
}
