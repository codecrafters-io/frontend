import Component from '@glimmer/component';
import showdown from 'showdown';
import { htmlSafe } from '@ember/template';
import { MarkdownBlock } from 'codecrafters-frontend/lib/blocks';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    model: MarkdownBlock;
  };
};

export default class MarkdownBlockComponent extends Component<Signature> {
  get html() {
    return htmlSafe(new showdown.Converter({ openLinksInNewWindow: true }).makeHtml(this.args.model.markdown));
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Blocks::MarkdownBlock': typeof MarkdownBlockComponent;
  }
}
