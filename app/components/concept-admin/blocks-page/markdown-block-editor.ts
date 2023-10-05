import Component from '@glimmer/component';
import { Block } from 'codecrafters-frontend/models/concept';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    model: Block;
  };
}

export default class MarkdownBlockEditorComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptAdmin::BlocksPage::MarkdownBlockEditor': typeof MarkdownBlockEditorComponent;
  }
}
