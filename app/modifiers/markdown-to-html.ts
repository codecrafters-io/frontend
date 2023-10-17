import Modifier from 'ember-modifier';
import showdown from 'showdown';
import { htmlSafe } from '@ember/template';

type Signature = {
  Args: {
    Positional: [markdown: string];
  };
};

export default class MarkdownToHtmlModifier extends Modifier<Signature> {
  convertMarkdownToHtml(markdown: string): string {
    return new showdown.Converter({}).makeHtml(markdown);
  }

  modify(element: HTMLElement, positional: [markdown: string]) {
    const htmlContent = this.convertMarkdownToHtml(positional[0]);
    element.innerHTML = htmlSafe(htmlContent).toString();
  }
}
