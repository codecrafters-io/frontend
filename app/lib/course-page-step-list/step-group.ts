import Step from 'codecrafters-frontend/lib/course-page-step-list/step';

export default class StepGroup {
  declare steps: Step[];

  constructor(steps: Step[]) {
    if (steps.length === 0) {
      throw new Error('StepGroup must have at least one step');
    }

    const expectedStepPositionsInGroup = steps.map((_, index) => index + 1);
    const actualStepPositionsInGroup = steps.map((step) => step.positionInGroup);

    if (expectedStepPositionsInGroup.join(',') !== actualStepPositionsInGroup.join(',')) {
      throw new Error(`StepGroup must have steps with consecutive positions. Actual positions: ${actualStepPositionsInGroup.join(', ')}`);
    }

    const expectedStepGlobalPositions = steps.map((_, index) => (steps[0] as Step).globalPosition + index);
    const actualStepGlobalPositions = steps.map((step) => step.globalPosition);

    if (expectedStepGlobalPositions.join(',') !== actualStepGlobalPositions.join(',')) {
      throw new Error(
        `StepGroup must have steps with consecutive global positions. Actual global positions: ${actualStepGlobalPositions.join(', ')}`,
      );
    }

    this.steps = steps;
  }

  get title(): string | null {
    throw new Error('Subclasses of StepGroup must implement a title getter');
  }

  get type(): 'BaseStagesStepGroup' | 'ExtensionStepGroup' {
    throw new Error('Subclasses of StepGroup must implement a type getter');
  }
}
