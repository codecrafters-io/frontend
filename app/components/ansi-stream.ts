import { action } from '@ember/object';
import Component from '@glimmer/component';
import { AnsiUp } from 'ansi_up';
import { task, rawTimeout } from 'ember-concurrency';
import { tracked } from 'tracked-built-ins';

interface Signature {
  Element: HTMLPreElement;

  Args: {
    content: string;
  };
}

export default class AnsiStreamComponent extends Component<Signature> {
  IS_DEBUG = true;

  @tracked displayContent: string = this.args.content;
  @tracked ansiParser: AnsiUp = new AnsiUp();
  @tracked displayHTML: string = this.ansiParser.ansi_to_html(this.displayContent);

  @action
  appendDisplayContent(content: string) {
    this.displayContent += content;
    this.displayHTML += this.ansiParser.ansi_to_html(content);
  }

  @action
  debugLog(...args: unknown[]) {
    if (this.IS_DEBUG) {
      console.log(...args);
    }
  }

  @action
  handleDidUpdateContent() {
    this.consumeContentDeltasTask.perform();
  }

  consumeContentDeltasTask = task({ keepLatest: true }, async (): Promise<void> => {
    // Content has been changed somehow
    if (this.args.content.slice(0, this.displayContent.length) !== this.displayContent) {
      this.debugLog('Resetting content');
      this.ansiParser = new AnsiUp();
      this.displayContent = this.args.content;
      this.displayHTML = this.ansiParser.ansi_to_html(this.displayContent);

      return;
    }

    const newContentDelta = this.args.content.slice(this.displayContent.length);
    const newContentDeltaChunks = newContentDelta.split(/(\s+)/);

    let counter = 11;

    const chunksCount = Math.max(1, Math.floor(newContentDeltaChunks.length / 10));

    while (newContentDeltaChunks.length > 0 && counter > 0) {
      console.time('splice');
      const chunksToFlush = newContentDeltaChunks.splice(0, chunksCount);
      console.timeEnd('splice');

      this.debugLog('Flushing', `${chunksToFlush.length}/${newContentDeltaChunks.length}`, 'chunks');

      console.time('append');
      this.appendDisplayContent(chunksToFlush.join(''));
      console.timeEnd('append');

      console.time('wait');
      await rawTimeout(100);
      console.timeEnd('wait');

      counter--;
    }

    // In case our math didn't work out, just flush the rest
    if (newContentDeltaChunks.length > 0) {
      this.debugLog('Flushing', newContentDeltaChunks.length, 'leftover chunks');
      this.appendDisplayContent(newContentDeltaChunks.join(''));
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
