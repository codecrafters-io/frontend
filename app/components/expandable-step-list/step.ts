import { action } from '@ember/object';
import { next } from '@ember/runloop';
import Component from '@glimmer/component';
import type { Step } from '../expandable-step-list';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    isExpanded: boolean;
    isFirstIncompleteStep: boolean;
    number: number;
    onCollapse: () => void;
    onExpand: () => void;
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

  @action
  handleExpandButtonClick() {
    next(() => {
      this.args.onExpand();
    });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ExpandableStepList::Step': typeof StepComponent;
  }
}
