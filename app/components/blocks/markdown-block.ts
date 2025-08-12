import Component from '@glimmer/component';
import { MarkdownBlockDefinition } from 'codecrafters-frontend/utils/block-definitions';
import { action } from '@ember/object';
import Prism from 'prismjs';
import 'prismjs/components/prism-rust'; // This is the only one we use in concepts at the moment

interface Signature {
  Element: HTMLDivElement;

  Args: {
    model: MarkdownBlockDefinition;
  };
}

export default class MarkdownBlock extends Component<Signature> {
  @action
  handleDidInsertHTML(element: HTMLDivElement) {
    Prism.highlightAllUnder(element);
  }

  @action
  handleDidUpdateHTML(element: HTMLDivElement) {
    Prism.highlightAllUnder(element);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Blocks::MarkdownBlock': typeof MarkdownBlock;
  }
}
