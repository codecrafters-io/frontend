import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';
import { service } from '@ember/service';
import type DarkModeService from 'codecrafters-frontend/services/dark-mode';
import type ClipboardService from 'codecrafters-frontend/services/clipboard';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    commands: string[];
    onCopyButtonClick?: () => void | Promise<void>;
    onVariantLabelClick?: (variant: string) => void;
    selectedVariantLabel?: string;
    variantLabels?: string[];
  };
}

export default class CopyableTerminalCommandComponent extends Component<Signature> {
  transition = fade;

  @service declare darkMode: DarkModeService;
  @service declare clipboard: ClipboardService;

  get codeForHighlighting(): string {
    return this.args.commands.join('\n');
  }

  get copyableText(): string {
    return this.args.commands.map((command) => command.replace(/# .*$/, '')).join('\n');
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CopyableTerminalCommand: typeof CopyableTerminalCommandComponent;
  }
}
