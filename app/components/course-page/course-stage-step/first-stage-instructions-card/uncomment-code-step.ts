import Component from '@glimmer/component';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import { action } from '@ember/object';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
    courseStage: CourseStageModel;
    isComplete: boolean;
    onComplete: () => void;
  };
}

export default class UncommentCodeStepComponent extends Component<Signature> {
  get filename() {
    return this.solution?.changedFiles[0]?.filename;
  }

  get solution() {
    return this.args.courseStage.solutions.find((solution) => solution.language === this.args.repository.language);
  }

  @action
  handleCompleteButtonClick() {
    this.args.onComplete();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::FirstStageInstructionsCard::UncommentCodeStep': typeof UncommentCodeStepComponent;
  }
}
