import Component from '@glimmer/component';
import config from 'codecrafters-frontend/config/environment';
import { action } from '@ember/object';
import { later } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';
import fade from 'ember-animated/transitions/fade';

interface Signature {
  Element: HTMLElement;

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

  @tracked wasCopiedRecently: boolean = false;

  get codeForHighlighting(): string {
    return this.args.commands.join('\n');
  }

  get copyableText(): string {
    return this.args.commands.map((command) => command.replace(/# .*$/, '')).join('\n');
  }

  @action
  handleCopyButtonClick() {
    if (config.environment !== 'test') {
      navigator.clipboard.writeText(this.copyableText);
    }

    this.wasCopiedRecently = true;

    later(
      this,
      () => {
        this.wasCopiedRecently = false;
      },
      1000,
    );

    if (this.args.onCopyButtonClick) {
      this.args.onCopyButtonClick();
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CopyableTerminalCommand: typeof CopyableTerminalCommandComponent;
  }
}
