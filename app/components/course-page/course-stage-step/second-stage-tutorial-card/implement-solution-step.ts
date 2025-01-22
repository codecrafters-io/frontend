import Component from '@glimmer/component';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type CourseStageLanguageGuideModel from 'codecrafters-frontend/models/course-stage-language-guide';
import type FeatureFlagsService from 'codecrafters-frontend/services/feature-flags';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
    courseStage: CourseStageModel;
    isComplete: boolean;
    languageGuide?: CourseStageLanguageGuideModel;
  };
}

export default class ImplementSolutionStepComponent extends Component<Signature> {
  @service declare featureFlags: FeatureFlagsService;
  @tracked solutionIsBlurred = true;

  get canSeeLanguageGuideBeforeSolution() {
    return this.featureFlags.canSeeLanguageGuideBeforeSolutionForStage2;
  }

  get solution() {
    return this.args.repository.secondStageSolution;
  }

  @action
  handleHideSolutionButtonClick() {
    this.solutionIsBlurred = true;
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
