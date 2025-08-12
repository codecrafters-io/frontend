import Component from '@glimmer/component';
import type { StepDefinition } from '../expandable-step-list';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    number: number;
    step: StepDefinition;
  };
}

export default class NonExpandableStepComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ExpandableStepList::NonExpandableStep': typeof NonExpandableStepComponent;
  }
}
