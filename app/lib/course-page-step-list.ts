import { tracked } from '@glimmer/tracking';
import CourseCompletedStep from 'codecrafters-frontend/lib/course-page-step-list/course-completed-step';
import CourseStageStep from 'codecrafters-frontend/lib/course-page-step-list/course-stage-step';
import IntroductionStep from 'codecrafters-frontend/lib/course-page-step-list/introduction-step';
import SetupStep from 'codecrafters-frontend/lib/course-page-step-list/setup-step';
import Step from 'codecrafters-frontend/lib/course-page-step-list/step';
import RepositoryStageListItemModel from 'codecrafters-frontend/models/repository-stage-list-item';
import { TemporaryRepositoryModel } from 'codecrafters-frontend/models/temporary-types';

// @ts-ignore: No types?
import { cached } from '@glimmer/tracking';

export { Step };

export class StepList {
  @tracked declare repository: TemporaryRepositoryModel;

  constructor(repository: TemporaryRepositoryModel) {
    this.repository = repository;
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

  @cached
  get steps(): Step[] {
    let steps: Step[] = [];
    let currentStepPosition = 0;

    steps.push(new IntroductionStep(this.repository, currentStepPosition++));
    steps.push(new SetupStep(this.repository, currentStepPosition++));

    if (!this.repository.stageList) {
      this.repository.course.sortedBaseStages.forEach((stage) => {
        // TODO: Find better way around this?
        const fakeStageListItem = { stage: stage, isDisabled: true } as RepositoryStageListItemModel;
        steps.push(new CourseStageStep(this.repository, fakeStageListItem, currentStepPosition++));
      });
    } else {
      this.repository.stageList.items.forEach((item) => {
        steps.push(new CourseStageStep(this.repository, item, currentStepPosition++));
      });
    }

    steps.push(new CourseCompletedStep(this.repository, currentStepPosition++));

    return steps;
  }
}
