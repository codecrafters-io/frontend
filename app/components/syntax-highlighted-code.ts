import * as shiki from 'shiki';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import getOrCreateCachedHighlighterPromise from 'codecrafters-frontend/utils/highlighter-cache';
import { tracked } from '@glimmer/tracking';
import { transformerCompactLineOptions } from '@shikijs/transformers';
import { task } from 'ember-concurrency';

export type Signature = {
  Element: HTMLDivElement;

  Args: {
    code: string;
    language: string;
    shouldDisplayLineNumbers: boolean;
    theme: string;
    highlightedLines?: string;
  };
};

export default class SyntaxHighlightedCodeComponent extends Component<Signature> {
  @tracked asyncHighlightedCode: string | null = null;
  @tracked asyncHighlightedHTML: string | null = null;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);

    this.highlightCode.perform();

    // if (config.environment === 'test' && error.message.match(/WebAssembly.instantiate/)) {
    //   console.log('ignoring WebAssembly error only present in tests');
    // } else {
    //   throw error;
    // }
  }

  get highlightedHtml() {
    if (this.asyncHighlightedCode === this.args.code) {
      return this.asyncHighlightedHTML!;
    } else {
      return this.temporaryHTML;
    }
  }

  get temporaryHTML() {
    const linesHTML = this.trimmedCode
      .split('\n')
      .map((line) => `<div class="line">${line}&nbsp;</div>`) // &nbsp; is used to ensure that empty lines are still rendered
      .join('');

    return `<pre><code>${linesHTML}</code></pre>`;
  }

  get trimmedCode() {
    return this.args.code.trim();
  }

  @action
  handleDidUpdateCode() {
    this.highlightCode.perform();
  }

  highlightCode = task({ keepLatest: true }, async (): Promise<void> => {
    const highlighterPromise = getOrCreateCachedHighlighterPromise(`${this.args.theme}-${this.args.language}`, {
      themes: [this.args.theme],
      langs: [this.args.language],
    });

    const lineOptions = (this.args.highlightedLines || '')
      .split(',')
      .flatMap((lineOrBlock) => [{ line: parseInt(lineOrBlock), classes: ['highlighted'] }]);

    highlighterPromise.then((highlighter) => {
      highlighter.loadLanguage(this.args.language as shiki.BundledLanguage | shiki.LanguageInput | shiki.SpecialLanguage).then(() => {
        this.asyncHighlightedHTML = highlighter.codeToHtml(this.trimmedCode, {
          lang: this.args.language,
          theme: this.args.theme,
          transformers: [transformerCompactLineOptions(lineOptions)],
        });
        this.asyncHighlightedCode = this.args.code;
      });
    });
  });
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    SyntaxHighlightedCode: typeof SyntaxHighlightedCodeComponent;
  }
}
