import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    title?: string;
    contentIdentifier?: string; // Use this to reset the collapse state when the content changes
    isCollapsedByDefault?: boolean;
    onExpand?: () => void;
    onCollapse?: () => void;
  };

  Blocks: {
    content: [];
    footer?: [];
    header?: []; // Either title or header should be provided
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
  handleContentIdentifierDidUpdate() {
    this.isCollapsed = this.args.isCollapsedByDefault ?? false;
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
