import DOMPurify from 'dompurify';
import Helper from '@ember/component/helper';
import showdown from 'showdown';
import { htmlSafe } from '@ember/template';
import type { SafeString } from '@ember/template/-private/handlebars';
import { service } from '@ember/service';
import type FastBoot from 'ember-cli-fastboot/services/fastboot';

export interface Signature {
  Args: {
    Positional: [string];
  };
  Return: SafeString;
}

export default class MarkdownToHtml extends Helper<Signature> {
  @service declare fastboot: FastBoot;

  public compute(positional: [string]): SafeString {
    // Older usages of this helper may not pass in a markdown string, hence the default '' value
    const htmlContent = this.convertMarkdownToHtml(positional[0] || '');

    return htmlSafe(htmlContent);
  }

  public convertMarkdownToHtml(markdown: string): string {
    const generatedHtml = new showdown.Converter({
      simplifiedAutoLink: true,
      strikethrough: true,
      tables: true,
      disableForced4SpacesIndentedSublists: true,
    }).makeHtml(markdown);

    // DOMPurify is not available in FastBoot mode, so we return the generated HTML as is
    if (this.fastboot.isFastBoot) {
      return generatedHtml;
    }

    DOMPurify.removeAllHooks();

    DOMPurify.addHook('afterSanitizeAttributes', (node) => {
      if (node.nodeName === 'A') {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
      }

      // https://github.com/PrismJS/prism/issues/3658
      // PrismJS unconditionally adds a tabindex to <pre> elements, without any opt-out
      if (node.nodeName === 'PRE') {
        node.setAttribute('tabindex', '-1');
      }
    });

    return DOMPurify.sanitize(generatedHtml);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'markdown-to-html': typeof MarkdownToHtml;
  }
}
