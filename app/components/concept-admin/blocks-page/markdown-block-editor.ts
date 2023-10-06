import Component from '@glimmer/component';
import { MarkdownBlock } from 'codecrafters-frontend/lib/blocks';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    model: MarkdownBlock;
  };
}

export default class MarkdownBlockEditorComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptAdmin::BlocksPage::MarkdownBlockEditor': typeof MarkdownBlockEditorComponent;
  }
}
