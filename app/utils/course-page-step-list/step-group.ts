import Step from 'codecrafters-frontend/lib/course-page-step-list/step';

export default class StepGroup {
  declare steps: Step[];

  constructor(steps: Step[]) {
    if (steps.length === 0) {
      throw new Error('StepGroup must have at least one step');
    }

    this.steps = steps;
  }

  get title(): string | null {
    throw new Error('Subclasses of StepGroup must implement a title getter');
  }

  get type(): 'BaseStagesStepGroup' | 'ExtensionStepGroup' | 'CourseCompletedStepGroup' {
    throw new Error('Subclasses of StepGroup must implement a type getter');
  }

  get visibleSteps() {
    return this.steps.filter((step) => !step.isHidden);
  }
}
