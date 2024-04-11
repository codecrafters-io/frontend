import { action } from '@ember/object';
import { next } from '@ember/runloop';
import Component from '@glimmer/component';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    number: number;
    title: string;
    isComplete: boolean;
    isExpanded: boolean;
    onExpand: () => void;
    onCollapse: () => void;
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
