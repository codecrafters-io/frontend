import Component from '@glimmer/component';
import { action } from '@ember/object';
import { waitFor } from '@ember/test-waiters';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';
import config from 'codecrafters-frontend/config/environment';

export type OnCopiedCallback = () => void | Promise<void>;

export interface CopyableAnythingSignature {
  Args: {
    value?: string | null;
    isDisabled?: boolean;
    onCopied?: OnCopiedCallback;
  };
  Blocks: {
    default: [() => void, boolean];
  };
  Element: null;
}

export default class CopyableAnythingComponent extends Component<CopyableAnythingSignature> {
  @tracked hasRecentlyCopied: boolean = false;

  @action
  @waitFor
  async copy(): Promise<void> {
    if (this.args.isDisabled) {
      return;
    }

    await navigator.clipboard.writeText(String(this.args.value));
    this.hasRecentlyCopied = true;

    try {
      if (this.args.onCopied) {
        await this.args.onCopied();
      }
    } finally {
      await timeout(config.x.copyConfirmationTimeout);
      this.hasRecentlyCopied = false;
    }
  }

  copyTask = task({ keepLatest: true }, async (): Promise<void> => {
    await this.copy();
  });
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CopyableAnything: typeof CopyableAnythingComponent;
  }
}
