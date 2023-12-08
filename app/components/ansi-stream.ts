import { action } from '@ember/object';
import Component from '@glimmer/component';
import { task, timeout } from 'ember-concurrency';
import { tracked } from 'tracked-built-ins';

interface Signature {
  Element: HTMLPreElement;

  Args: {
    content: string;
  };
}

export default class AnsiStreamComponent extends Component<Signature> {
  @tracked displayContent: string = this.args.content;

  @action
  handleDidUpdateContent() {
    this.consumeContentDeltasTask.perform();
  }

  consumeContentDeltasTask = task({ keepLatest: true }, async (): Promise<void> => {
    // Content has been changed somehow
    if (this.args.content.slice(0, this.displayContent.length) !== this.displayContent) {
      this.displayContent = this.args.content;

      return;
    }

    const newContentDelta = this.args.content.slice(this.displayContent.length);
    const newContentDeltaChunks = newContentDelta.split(/(\s+)/);

    let counter = 10;

    while (newContentDeltaChunks.length > 0 && counter > 0) {
      const chunksCount = Math.min(1, Math.floor(newContentDeltaChunks.length / 10));
      const chunksToFlush = newContentDeltaChunks.splice(0, chunksCount);

      this.displayContent += chunksToFlush.join('');
      await timeout(100);
      counter--;
    }

    // In case our math didn't work out, just flush the rest
    if (newContentDeltaChunks.length > 0) {
      this.displayContent += newContentDeltaChunks.join('');
    }

    if (this.args.content !== this.displayContent) {
      this.consumeContentDeltasTask.perform();
    }
  });
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    AnsiStream: typeof AnsiStreamComponent;
  }
}
