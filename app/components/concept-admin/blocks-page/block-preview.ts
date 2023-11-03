import Component from '@glimmer/component';
import { Block, ClickToContinueBlock, ConceptAnimationBlock, ConceptQuestionBlock, MarkdownBlock } from 'codecrafters-frontend/lib/blocks';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    model: Block;
  };
}

export default class BlockPreviewComponent extends Component<Signature> {
  get modelAsClickToContinueBlock(): ClickToContinueBlock {
    return this.args.model as ClickToContinueBlock;
  }

  get modelAsConceptAnimationBlock(): ConceptAnimationBlock {
    return this.args.model as ConceptAnimationBlock;
  }

  get modelAsConceptQuestionBlock(): ConceptQuestionBlock {
    return this.args.model as ConceptQuestionBlock;
  }

  get modelAsMarkdownBlock(): MarkdownBlock {
    return this.args.model as MarkdownBlock;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptAdmin::BlocksPage::BlockPreview': typeof BlockPreviewComponent;
  }
}
