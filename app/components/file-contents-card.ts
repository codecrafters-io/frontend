import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    code: string;
    language: string;
    filename: string;
    headerTooltipText?: string; // If collapsible, use this to provide a tooltip for the header
    isCollapsible?: boolean;
    isCollapsed?: boolean;
    onExpand?: () => void;
    onCollapse?: () => void;
  };

  Blocks: {
    header?: [];
  };
}

export default class FileContentsCardComponent extends Component<Signature> {
  @tracked containerElement: HTMLDivElement | null = null;

  @action
  handleCollapseButtonClick() {
    if (this.args.onCollapse) {
      this.args.onCollapse();
      this.containerElement!.scrollIntoView({ behavior: 'smooth' });
    }
  }

  @action
  handleDidInsertContainer(element: HTMLDivElement) {
    this.containerElement = element;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    FileContentsCard: typeof FileContentsCardComponent;
  }
}
