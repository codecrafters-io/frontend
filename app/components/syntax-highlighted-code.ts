import Component from '@glimmer/component';
import config from 'codecrafters-frontend/config/environment';
import getOrCreateCachedHighlighterPromise from 'codecrafters-frontend/utils/highlighter-cache';
import { htmlSafe } from '@ember/template';
import { tracked } from '@glimmer/tracking';
import type { SafeString } from '@ember/template/-private/handlebars';

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
  @tracked asyncHighlightedHTML?: SafeString;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);

    const highlighterPromise = getOrCreateCachedHighlighterPromise(`${this.args.theme}-${this.args.language}`, {
      theme: this.args.theme,
      // @ts-expect-error - shiki types are not up to date
      langs: [this.args.language],
    });

    const lineOptions = (this.args.highlightedLines || '')
      .split(',')
      .flatMap((lineOrBlock) => [{ line: parseInt(lineOrBlock), classes: ['highlighted'] }]);

    highlighterPromise
      .then((highlighter) => {
        this.asyncHighlightedHTML = htmlSafe(highlighter.codeToHtml(this.trimmedCode, { lang: this.args.language, lineOptions: lineOptions }));

        // Uncomment to test temporaryHTML rendering
        // this.asyncHighlightedHTML = this.temporaryHTML;
      })
      .catch((error) => {
        if (config.environment === 'test' && error.message.match(/WebAssembly.instantiate/)) {
          console.log('ignoring WebAssembly error only present in tests');
        } else {
          throw error;
        }
      });
  }

  get highlightedHtml() {
    return this.asyncHighlightedHTML || this.temporaryHTML;
  }

  get temporaryHTML() {
    const linesHTML = this.trimmedCode
      .split('\n')
      .map((line) => `<div class="line">${line}&nbsp;</div>`) // &nbsp; is used to ensure that empty lines are still rendered
      .join('');

    return htmlSafe(`<pre><code>${linesHTML}</code></pre>`);
  }

  get trimmedCode() {
    return this.args.code.trim();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    SyntaxHighlightedCode: typeof SyntaxHighlightedCodeComponent;
  }
}
