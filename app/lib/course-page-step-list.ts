import { tracked } from '@glimmer/tracking';
import CourseCompletedStep from 'codecrafters-frontend/lib/course-page-step-list/course-completed-step';
import CourseStageStep from 'codecrafters-frontend/lib/course-page-step-list/course-stage-step';
import IntroductionStep from 'codecrafters-frontend/lib/course-page-step-list/introduction-step';
import SetupStep from 'codecrafters-frontend/lib/course-page-step-list/setup-step';
import Step from 'codecrafters-frontend/lib/course-page-step-list/step';

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

export function buildStepList(repository: unknown): StepList {
  let steps = [];

  steps.push(new IntroductionStep(repository));
  steps.push(new SetupStep(repository));

  // @ts-ignore
  repository.course.sortedStages.forEach((courseStage) => {
    steps.push(new CourseStageStep(repository, courseStage));
  });

  steps.push(new CourseCompletedStep(repository));

  return new StepList(steps);
}
