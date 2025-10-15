import Component from '@glimmer/component';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
    courseStage: CourseStageModel;
    isComplete: boolean;
  };
}

export default class ImplementSolutionStep extends Component<Signature> {
  @tracked revealedHintIndexes: number[] = [];
  @tracked solutionIsBlurred = true;

  get languageGuide() {
    return this.args.courseStage.languageGuides.findBy('language', this.args.repository.language);
  }

  get solution() {
    return this.args.repository.secondStageSolution;
  }

  @action
  handleHideSolutionButtonClick(): void {
    this.solutionIsBlurred = true;
  }

  @action
  handleRevealHintButtonClick(hintIndex: number): void {
    if (this.revealedHintIndexes.includes(hintIndex)) {
      return;
    }

    this.revealedHintIndexes = [...this.revealedHintIndexes, hintIndex];
  }

  @action
  handleRevealSolutionButtonClick(): void {
    this.solution?.createView();
    this.solutionIsBlurred = false;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::SecondStageYourTaskCard::ImplementSolutionStep': typeof ImplementSolutionStep;
  }
}
