import { tracked } from '@glimmer/tracking';
import CourseCompletedStep from 'codecrafters-frontend/lib/course-page-step-list/course-completed-step';
import CourseStageStep from 'codecrafters-frontend/lib/course-page-step-list/course-stage-step';
import IntroductionStep from 'codecrafters-frontend/lib/course-page-step-list/introduction-step';
import SetupStep from 'codecrafters-frontend/lib/course-page-step-list/setup-step';
import Step from 'codecrafters-frontend/lib/course-page-step-list/step';
import RepositoryStageListItemModel from 'codecrafters-frontend/models/repository-stage-list-item';
import { TemporaryRepositoryModel } from 'codecrafters-frontend/models/temporary-types';

export { Step };

export class StepList {
  @tracked steps;

  constructor(steps: Step[]) {
    this.steps = steps;
  }

  get visibleSteps() {
    return this.steps.filter((step) => !step.isHidden);
  }

  get activeStep() {
    return this.steps.find((step) => step.status !== 'complete');
  }

  nextVisibleStepFor(step: Step): Step | null {
    return this.visibleSteps[this.visibleSteps.indexOf(step) + 1] || null;
  }

  previousVisibleStepFor(step: Step): Step | null {
    return this.visibleSteps[this.visibleSteps.indexOf(step) - 1] || null;
  }
}

export function buildStepList(repository: TemporaryRepositoryModel): StepList {
  let steps = [];
  let currentStepPosition = 0;

  steps.push(new IntroductionStep(repository, currentStepPosition++));
  steps.push(new SetupStep(repository, currentStepPosition++));

  if (!repository.stageList) {
    repository.course.sortedStages.forEach((stage) => {
      // TODO: Find better way around this
      const fakeStageListItem = { stage: stage, isDisabled: true } as RepositoryStageListItemModel;
      steps.push(new CourseStageStep(repository, fakeStageListItem, currentStepPosition++));
    });
  } else {
    repository.stageList.items.forEach((item) => {
      steps.push(new CourseStageStep(repository, item, currentStepPosition++));
    });
  }

  steps.push(new CourseCompletedStep(repository, currentStepPosition++));

  return new StepList(steps);
}
