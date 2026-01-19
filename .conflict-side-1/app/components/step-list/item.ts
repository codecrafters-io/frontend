import Component from '@glimmer/component';

export interface StepDefinition {
  id: string;
  titleMarkdown: string;
  isComplete: boolean;
}

interface Signature {
  Element: HTMLDivElement;

  Args: {
    step: StepDefinition;
    stepIndex: number;
    totalStepsCount: number; // Used to determine if this is the last step
  };

  Blocks: {
    default: [];
  };
}

export default class StepListItem extends Component<Signature> {
  get isLastStep(): boolean {
    return this.args.stepIndex === this.args.totalStepsCount - 1;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'StepList::Item': typeof StepListItem;
  }
}
