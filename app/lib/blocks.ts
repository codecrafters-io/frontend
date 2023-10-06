import { camelize } from '@ember/string';

interface BlockJSON {
  [key: string]: unknown;
}

class Block {
  get type(): string {
    return (this.constructor as typeof Block).type;
  }

  static type: string;

  static fromJSON(this: new () => Block, json: BlockJSON): Block {
    const block = new this();

    for (const [key, value] of Object.entries(json)) {
      (block as any)[camelize(key)] = value; // eslint-disable-line @typescript-eslint/no-explicit-any
    }

    return block;
  }
}

class ClickToContinueBlock extends Block {
  static type = 'click_to_continue';

  static fromJSON(json: BlockJSON): ClickToContinueBlock {
    return super.fromJSON(json) as ClickToContinueBlock;
  }

  buttonText = 'Continue';
  isInteractable = true;
}

class MarkdownBlock extends Block {
  static type = 'markdown';

  static fromJSON(json: BlockJSON): MarkdownBlock {
    return super.fromJSON(json) as MarkdownBlock;
  }

  markdown!: string;
  isInteractable = false;
}

class ConceptAnimationBlock extends Block {
  static type = 'concept_animation';

  static fromJSON(json: BlockJSON): ConceptAnimationBlock {
    return super.fromJSON(json) as ConceptAnimationBlock;
  }

  conceptAnimationSlug!: string;
  isInteractable = false;
}

class ConceptQuestionBlock extends Block {
  static type = 'concept_question';

  static fromJSON(json: BlockJSON): ConceptQuestionBlock {
    return super.fromJSON(json) as ConceptQuestionBlock;
  }

  conceptQuestionSlug!: string;
  isInteractable = true;
}

export { ClickToContinueBlock, MarkdownBlock, ConceptQuestionBlock, ConceptAnimationBlock };
