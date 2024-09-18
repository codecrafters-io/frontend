import Component from '@glimmer/component';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
    courseStage: CourseStageModel;
    isComplete: boolean;
  };
}

export default class UncommentCodeStepComponent extends Component<Signature> {
  get filename() {
    return this.args.repository.firstStageSolution?.changedFiles[0]?.filename;
  }

  get solution() {
    return this.args.repository.firstStageSolution;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::FirstStageTutorialCard::UncommentCodeStep': typeof UncommentCodeStepComponent;
  }
}
