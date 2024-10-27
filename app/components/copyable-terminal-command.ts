import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import fade from 'ember-animated/transitions/fade';
import type DarkModeService from 'codecrafters-frontend/services/dark-mode';
import { service } from '@ember/service';
import config from 'codecrafters-frontend/config/environment';
import { task, timeout } from 'ember-concurrency';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    commands: string[];
    onCopyButtonClick?: () => void;
    onVariantLabelClick?: (variant: string) => void;
    selectedVariantLabel?: string;
    variantLabels?: string[];
  };
}

export default class CopyableTerminalCommandComponent extends Component<Signature> {
  transition = fade;

  @service declare darkMode: DarkModeService;

  @tracked wasCopiedRecently: boolean = false;

  get codeForHighlighting(): string {
    return this.args.commands.join('\n');
  }

  get copyableText(): string {
    return this.args.commands.map((command) => command.replace(/# .*$/, '')).join('\n');
  }

  handleCopyButtonClickTask = task({ keepLatest: true }, async (): Promise<void> => {
    await navigator.clipboard.writeText(this.copyableText);
    this.wasCopiedRecently = true;

    if (this.args.onCopyButtonClick) {
      this.args.onCopyButtonClick();
    }

    await timeout(config.x.copyConfirmationTimeout);
    this.wasCopiedRecently = false;
  });
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CopyableTerminalCommand: typeof CopyableTerminalCommandComponent;
  }
}
