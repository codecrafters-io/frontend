import AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import Component from '@glimmer/component';
import config from 'codecrafters-frontend/config/environment';
import fade from 'ember-animated/transitions/fade';
import type DarkModeService from 'codecrafters-frontend/services/dark-mode';
import { action } from '@ember/object';
import { later } from '@ember/runloop';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

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

export default class CopyableTerminalCommand extends Component<Signature> {
  transition = fade;

  @service declare analyticsEventTracker: AnalyticsEventTrackerService;
  @service declare darkMode: DarkModeService;

  @tracked wasCopiedRecently: boolean = false;

  get codeForHighlighting(): string {
    return this.args.commands.join('\n');
  }

  get copyableText(): string {
    return this.args.commands.map((command) => command.replace(/# .*$/, '')).join('\n');
  }

  @action
  async handleCopyButtonClick() {
    await navigator.clipboard.writeText(this.copyableText);

    this.analyticsEventTracker.track('copied_terminal_command', {
      copied_text: this.copyableText,
      copy_method: 'button', // TODO: Add event tracking for clipboard select
      displayed_commands: this.args.commands,
    });

    this.wasCopiedRecently = true;

    later(
      this,
      () => {
        this.wasCopiedRecently = false;
      },
      config.environment !== 'test' ? 1000 : 10,
    );

    if (this.args.onCopyButtonClick) {
      this.args.onCopyButtonClick();
    }
  }

  @action
  async handleCopyEvent() {
    this.analyticsEventTracker.track('copied_terminal_command', {
      copied_text: document.getSelection()?.toString() || 'unknown',
      copy_method: 'select',
      displayed_commands: this.args.commands,
    });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CopyableTerminalCommand: typeof CopyableTerminalCommand;
  }
}
