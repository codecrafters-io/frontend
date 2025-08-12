import Component from '@glimmer/component';
import { MarkdownBlockDefinition } from 'codecrafters-frontend/utils/block-definitions';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    model: MarkdownBlockDefinition;
  };
}

export default class MarkdownBlockEditor extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptAdmin::BlocksPage::MarkdownBlockEditor': typeof MarkdownBlockEditor;
  }
}
