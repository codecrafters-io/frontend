import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    title?: string;
    isCollapsedByDefault?: boolean;
    onExpand?: () => void;
    onCollapse?: () => void;
  };

  Blocks: {
    content: [];
    footer: [];
  };
}

export default class InstructionsCardComponent extends Component<Signature> {
  @tracked isCollapsed = this.args.isCollapsedByDefault ?? false;

  @action
  handleCollapseButtonClick() {
    this.isCollapsed = true;
    this.args.onCollapse?.();
  }

  @action
  handleExpandButtonClick() {
    this.isCollapsed = false;
    this.args.onExpand?.();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::InstructionsCard': typeof InstructionsCardComponent;
  }
}
