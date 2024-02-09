import Component from '@glimmer/component';

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
  get isCollapsed() {
    return !!this.args.isCollapsed;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    FileContentsCard: typeof FileContentsCardComponent;
  }
}
