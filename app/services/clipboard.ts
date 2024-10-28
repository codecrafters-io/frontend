import { action } from '@ember/object';
import Service from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { tracked } from '@glimmer/tracking';
import config from 'codecrafters-frontend/config/environment';
import { task, timeout } from 'ember-concurrency';

export default class ClipboardService extends Service {
  @tracked hasRecentlyCopied: boolean = false;

  @action
  @waitFor
  async copy(code: string, onCopyCallback?: () => void | Promise<void>): Promise<void> {
    await navigator.clipboard.writeText(code);
    this.hasRecentlyCopied = true;

    try {
      if (onCopyCallback) {
        await onCopyCallback();
      }
    } finally {
      await timeout(config.x.copyConfirmationTimeout);
      this.hasRecentlyCopied = false;
    }
  }

  copyTask = task({ keepLatest: true }, async (code: string, onCopyCallback?: () => void | Promise<void>): Promise<void> => {
    await this.copy(code, onCopyCallback);
  });
}

declare module '@ember/service' {
  interface Registry {
    clipboard: ClipboardService;
  }
}
