import Component from '@glimmer/component';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
    courseStage: CourseStageModel;
    isComplete: boolean;
    shouldRecommendLanguageGuide: boolean;
    shouldShowSolution: boolean;
  };
}

export default class ImplementSolutionStepComponent extends Component<Signature> {
  @tracked solutionIsBlurred = true;

  get solution() {
    return this.args.repository.secondStageSolution;
  }

  @action
  handleRevealSolutionButtonClick() {
    this.solution?.createView();
    this.solutionIsBlurred = false;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::SecondStageTutorialCard::ImplementSolutionStep': typeof ImplementSolutionStepComponent;
  }
}