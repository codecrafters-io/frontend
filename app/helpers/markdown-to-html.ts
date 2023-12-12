import Helper from '@ember/component/helper';
import showdown from 'showdown';
import { htmlSafe } from '@ember/template';
import { SafeString } from '@ember/template/-private/handlebars';
import config from 'codecrafters-frontend/config/environment';

export interface Signature {
  Args: {
    Positional: [string];
  };
  Return: SafeString;
}

export default class MarkdownToHtml extends Helper<Signature> {
  public compute(positional: [string]): SafeString {
    // Older usages of this helper may not pass in a markdown string
    if (!positional[0]) {
      if (config.environment === 'test') {
        throw new Error('MarkdownToHtml helper called with no markdown');
      } else {
        console.warn('MarkdownToHtml helper called with no markdown');
      }

      positional[0] = '';
    }

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
