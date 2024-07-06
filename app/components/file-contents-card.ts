import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type DarkModeService from 'codecrafters-frontend/services/dark-mode';

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
  @service declare darkMode: DarkModeService;

  @tracked containerElement: HTMLDivElement | null = null;

  @action
  handleCollapseExpandButtonClick() {
    if (!this.args.isCollapsible) {
      return;
    }

    if (this.args.isCollapsed && this.args.onExpand) {
      this.args.onExpand();
    } else if (!this.args.isCollapsed && this.args.onCollapse) {
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
