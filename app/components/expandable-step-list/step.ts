import Component from '@glimmer/component';
import type { Step } from '../expandable-step-list';
import { action } from '@ember/object';
import { next } from '@ember/runloop';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    isExpanded: boolean;
    isFirstIncompleteStep: boolean;
    number: number;
    nextIncompleteStep: Step | null;
    onCollapse: () => void;
    onManualComplete: () => void;
    step: Step;
  };

  Blocks: {
    default: [];
  };
};

export default class StepComponent extends Component<Signature> {
  @action
  handleCollapseButtonClick() {
    next(() => {
      this.args.onCollapse();
    });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ExpandableStepList::Step': typeof StepComponent;
  }
}
