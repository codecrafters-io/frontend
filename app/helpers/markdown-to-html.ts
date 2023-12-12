import Helper from '@ember/component/helper';
import showdown from 'showdown';
import { htmlSafe } from '@ember/template';
import { SafeString } from '@ember/template/-private/handlebars';

export interface Signature {
  Args: {
    Positional: [string];
  };
  Return: SafeString;
}

export default class MarkdownToHtml extends Helper<Signature> {
  public compute(positional: [string]): SafeString {
    const htmlContent = this.convertMarkdownToHtml(positional[0]);

    return htmlSafe(htmlContent);
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
