import { action } from '@ember/object';
import { next } from '@ember/runloop';
import Component from '@glimmer/component';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    canBeCompletedManually: boolean;
    isComplete: boolean;
    isExpanded: boolean;
    number: number;
    onCollapse: () => void;
    onExpand: () => void;
    onManualComplete: () => void;
    title: string;
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
