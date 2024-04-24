import Component from '@glimmer/component';
import type { Step } from '../expandable-step-list';
import { action } from '@ember/object';
import { next } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';

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
  @tracked previousIsComplete: boolean | null = null;

  @action
  handleCollapseButtonClick() {
    next(() => {
      this.args.onCollapse();
    });
  }

  @action
  handleDidUpdateIsComplete(_element: Signature['Element'], [newIsComplete]: [boolean]) {
    if (this.args.isExpanded && this.previousIsComplete === false && newIsComplete === true) {
      this.args.onCollapse();
    }

    this.previousIsComplete = newIsComplete;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ExpandableStepList::Step': typeof StepComponent;
  }
}
