import Modifier from 'ember-modifier';
import showdown from 'showdown';
import { htmlSafe } from '@ember/template';

type Signature = {
  Args: {
    Positional: [markdown?: string];
  };
};

export default class MarkdownToHtmlModifier extends Modifier<Signature> {
  convertMarkdownToHtml(markdown: string): string {
    return new showdown.Converter({
      simplifiedAutoLink: true,
      openLinksInNewWindow: true,
      strikethrough: true,
      tables: true,
      disableForced4SpacesIndentedSublists: true,
    }).makeHtml(markdown);
  }

  modify(element: HTMLElement, positional: [markdown?: string]) {
    if (!positional[0]) {
      return;
    }

    const htmlContent = this.convertMarkdownToHtml(positional[0]);
    element.innerHTML = htmlSafe(htmlContent).toString();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'markdown-to-html': typeof MarkdownToHtmlModifier;
  }
}
