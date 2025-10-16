import Component from '@glimmer/component';

export interface StepDefinition {
  id: string;
  titleMarkdown: string;
  isComplete: boolean;
  canBeCompletedManually: boolean;
}

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onManualStepComplete?: (step: StepDefinition) => void;
    steps: StepDefinition[];
    stepContainerClass?: string;
  };

  Blocks: {
    default: [
      {
        step: StepDefinition;
      },
    ];
  };
}

export default class StepList extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    StepList: typeof StepList;
  }
}
