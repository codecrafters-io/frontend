import Helper from '@ember/component/helper';
import showdown from 'showdown';
import { htmlSafe } from '@ember/template';

export interface Signature {
  Args: {
    Positional: Array<string | undefined | null>;
  };
  Return: string | undefined;
}

export default class MarkdownToHtml extends Helper<Signature> {
  public compute(positional: Array<string | undefined | null>): string | undefined {
    if (!positional[0]) {
      return;
    }

    const htmlContent = this.convertMarkdownToHtml(positional[0]);

    return htmlSafe(htmlContent).toString();
  }

  public convertMarkdownToHtml(markdown: string): string {
    return new showdown.Converter({
      simplifiedAutoLink: true,
      openLinksInNewWindow: true,
      strikethrough: true,
      tables: true,
      disableForced4SpacesIndentedSublists: true,
    }).makeHtml(markdown);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'markdown-to-html': typeof MarkdownToHtml;
  }
}
