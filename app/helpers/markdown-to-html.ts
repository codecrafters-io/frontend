import DOMPurify from 'dompurify';
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
    // Older usages of this helper may not pass in a markdown string, hence the default '' value
    const htmlContent = this.convertMarkdownToHtml(positional[0] || '');

    return htmlSafe(htmlContent);
  }

  public convertMarkdownToHtml(markdown: string): string {
    DOMPurify.removeAllHooks();

    DOMPurify.addHook('afterSanitizeAttributes', (node) => {
      if (node.nodeName === 'A') {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
      }
    });

    return DOMPurify.sanitize(
      new showdown.Converter({
        simplifiedAutoLink: true,
        strikethrough: true,
        tables: true,
        disableForced4SpacesIndentedSublists: true,
      }).makeHtml(markdown),
    );
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'markdown-to-html': typeof MarkdownToHtml;
  }
}
