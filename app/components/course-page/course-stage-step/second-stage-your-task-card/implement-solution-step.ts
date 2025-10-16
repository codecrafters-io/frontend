import Component from '@glimmer/component';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import fade from 'ember-animated/transitions/fade';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
    courseStage: CourseStageModel;
    isComplete: boolean;
  };
}

export default class ImplementSolutionStep extends Component<Signature> {
  transition = fade;

  @tracked expandedHintIndex: number | null = null;
  @tracked solutionIsBlurred = true;

  get solution() {
    return this.args.repository.secondStageSolution;
  }

  @action
  handleHideSolutionButtonClick(): void {
    this.solutionIsBlurred = true;
  }

  @action
  handleHintCardHeaderClick(hintIndex: number): void {
    if (this.expandedHintIndex === hintIndex) {
      this.expandedHintIndex = null;
    } else {
      this.expandedHintIndex = hintIndex;
    }
  }

  @action
  handleRevealSolutionButtonClick(): void {
    this.solution?.createView();
    this.solutionIsBlurred = false;
    this.expandedHintIndex = null;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::SecondStageYourTaskCard::ImplementSolutionStep': typeof ImplementSolutionStep;
  }
}
