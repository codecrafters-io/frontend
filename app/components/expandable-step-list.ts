import { action } from '@ember/object';
import { next } from '@ember/runloop';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export interface Step {
  id: string;
  titleMarkdown: string;
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
      },
    ];
  };
}

export default class ExpandableStepListComponent extends Component<Signature> {
  @tracked containerElement: HTMLDivElement | null = null;
  @tracked expandedStepId: string | null = null;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);

    const firstIncompleteStep = this.firstIncompleteStep;
    const firstStep = this.args.steps[0];

    if (firstIncompleteStep && firstStep && firstIncompleteStep.id !== firstStep.id) {
      this.expandedStepId = firstIncompleteStep.id;
    }
  }

  get expandedStep(): Step | null {
    return this.args.steps.find((step) => step.id === this.expandedStepId) ?? null;
  }

  get firstIncompleteStep(): Step | null {
    return this.args.steps.find((step) => !step.isComplete) ?? null;
  }

  get nextIncompleteStep(): Step | null {
    if (!this.expandedStep) {
      return this.firstIncompleteStep;
    }

    const expandedStepIndex = this.args.steps.indexOf(this.expandedStep);

    return this.args.steps.slice(expandedStepIndex + 1).find((step) => !step.isComplete) ?? null;
  }

  @action
  expandNextIncompleteStep() {
    if (this.nextIncompleteStep) {
      this.#expandStepAndScrollContainerIntoView(this.nextIncompleteStep);
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
      this.expandNextIncompleteStep();
    });
  }

  @action
  handleStepCollapse(_collapsedStep: Step) {
    next(() => {
      this.expandNextIncompleteStep();
    });
  }

  @action
  handleStepCompletedManually(step: Step) {
    next(() => {
      this.expandNextIncompleteStep();

      if (this.args.onManualStepComplete) {
        this.args.onManualStepComplete(step);
      }
    });
  }

  @action
  handleStepExpand(step: Step) {
    if (this.expandedStepId === step.id) {
      return;
    }

    // Don't allow expanding incomplete steps other than the first incomplete step
    if (!step.isComplete && step.id !== this.firstIncompleteStep?.id) {
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
