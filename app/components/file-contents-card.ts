import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type DarkModeService from 'codecrafters-frontend/services/dark-mode';
import { codeCraftersDark, codeCraftersLight } from 'codecrafters-frontend/utils/code-mirror-themes';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    /**
     * Code to render in CodeMirror
     */
    code: string;
    /**
     * Filename to render in the header.
     * Also used to auto-detect language for code formatting
     */
    filename: string;
    /**
     * Override language auto-detected from `filename` and set it manually
     */
    language: string;
    /**
     * Enable code folding and fold gutter in CodeMirror
     */
    foldGutter?: boolean;
    /**
     * Enable collapsing of the file card to just the header
     */
    isCollapsible?: boolean;
    /**
     * Should the card be currently collapsed
     */
    isCollapsed?: boolean;
    /**
     * Show a tooltip in the header when collapsible & collapsed
     */
    headerTooltipText?: string;
    /**
     * Scroll the component into view after it's collapsed
     */
    scrollIntoViewOnCollapse?: boolean;
    /**
     *  Callback to call when Expand button is clicked
     */
    onExpand?: () => void;
    /**
     *  Callback to call when Collapse button is clicked
     */
    onCollapse?: () => void;
  };

  Blocks: {
    /**
     * Allows rendering custom content in the header
     */
    header?: [];
  };
}

export default class FileContentsCardComponent extends Component<Signature> {
  @service declare darkMode: DarkModeService;

  @tracked containerElement: HTMLDivElement | null = null;

  get codeMirrorTheme() {
    return this.darkMode.isEnabled ? codeCraftersDark : codeCraftersLight;
  }

  @action
  handleCollapseOrExpandButtonClick() {
    if (!this.args.isCollapsible) {
      return;
    }

    if (this.args.isCollapsed && this.args.onExpand) {
      this.args.onExpand();
    } else if (!this.args.isCollapsed) {
      if (this.args.onCollapse) {
        this.args.onCollapse();
      }

      if (this.args.scrollIntoViewOnCollapse !== false) {
        this.containerElement!.scrollIntoView({ behavior: 'smooth' });
      }
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
