import { action } from '@ember/object';
import { next } from '@ember/runloop';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export interface Step {
  id: string;
  title: string;
  isComplete: boolean;
  canBeCompletedManually: boolean;
}

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onManualStepComplete?: (step: Step) => void;
    steps: Step[];
    stepContainerClass?: string;
  };

  Blocks: {
    default: [
      {
        expandedStep: Step | null;
        expandNextStep: () => void;
      },
    ];
  };
}

export default class ExpandableStepListComponent extends Component<Signature> {
  @tracked containerElement: HTMLDivElement | null = null;
  @tracked expandedStepId: string | null = null;

  get expandedStep(): Step | null {
    return this.args.steps.find((step) => step.id === this.expandedStepId) ?? null;
  }

  get firstIncompleteStep(): Step | null {
    return this.args.steps.find((step) => !step.isComplete) ?? null;
  }

  get nextStepAfterExpandedStep(): Step | null {
    if (!this.expandedStep) {
      return null;
    }

    const stepIndex = this.args.steps.indexOf(this.expandedStep);

    return this.args.steps[stepIndex + 1] || null;
  }

  @action
  expandNextStep() {
    if (this.nextStepAfterExpandedStep) {
      this.#expandStepAndScrollContainerIntoView(this.nextStepAfterExpandedStep);
    } else {
      this.expandedStepId = null;
    }
  }

  #expandStepAndScrollContainerIntoView(step: Step) {
    this.expandedStepId = step.id;

    if (this.containerElement) {
      this.containerElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  @action
  handleDidInsertContainer(element: HTMLDivElement) {
    this.containerElement = element;
  }

  @action
  handleNextStepButtonClick() {
    next(() => {
      this.expandNextStep();
    });
  }

  @action
  handleStepCollapse(collapsedStep: Step) {
    if (this.firstIncompleteStep && this.firstIncompleteStep.id !== collapsedStep.id) {
      this.#expandStepAndScrollContainerIntoView(this.firstIncompleteStep);
    } else {
      this.expandedStepId = null;
    }
  }

  @action
  handleStepCompletedManually(step: Step) {
    if (this.args.onManualStepComplete) {
      this.args.onManualStepComplete(step);
    }

    this.expandNextStep();
  }

  @action
  handleStepExpand(step: Step) {
    if (this.expandedStepId === step.id) {
      return;
    }

    this.#expandStepAndScrollContainerIntoView(step);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    ExpandableStepList: typeof ExpandableStepListComponent;
  }
}
