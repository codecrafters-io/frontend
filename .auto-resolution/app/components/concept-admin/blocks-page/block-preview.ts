import Component from '@glimmer/component';
import {
  ClickToContinueBlockDefinition,
  ConceptAnimationBlockDefinition,
  ConceptQuestionBlockDefinition,
  MarkdownBlockDefinition,
} from 'codecrafters-frontend/utils/block-definitions';
import { type BlockDefinition } from 'codecrafters-frontend/models/concept';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    model: BlockDefinition;
  };
}

export default class BlockPreview extends Component<Signature> {
  get modelAsClickToContinueBlockDefinition(): ClickToContinueBlockDefinition {
    return this.args.model as ClickToContinueBlockDefinition;
  }

  get modelAsConceptAnimationBlockDefinition(): ConceptAnimationBlockDefinition {
    return this.args.model as ConceptAnimationBlockDefinition;
  }

  get modelAsConceptQuestionBlockDefinition(): ConceptQuestionBlockDefinition {
    return this.args.model as ConceptQuestionBlockDefinition;
  }

  get modelAsMarkdownBlockDefinition(): MarkdownBlockDefinition {
    return this.args.model as MarkdownBlockDefinition;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptAdmin::BlocksPage::BlockPreview': typeof BlockPreview;
  }
}
