import { camelize } from '@ember/string';

interface BlockJSON {
  [key: string]: any;
}

class Block {
  static type: string;

  static fromJSON(json: BlockJSON): Block {
    const block = new this();

    for (const [key, value] of Object.entries(json)) {
      (block as any)[camelize(key)] = value;
    }

    return block;
  }

  get type(): string {
    return (this.constructor as typeof Block).type;
  }
}

class ClickToContinueBlock extends Block {
  static type = 'click_to_continue';

  buttonText = 'Continue';
  isInteractable = true;
}

class MarkdownBlock extends Block {
  static type = 'markdown';

  markdown?: string;
  isInteractable = false;
}

class ConceptAnimationBlock extends Block {
  static type = 'concept_animation';

  conceptAnimationSlug?: string;
  isInteractable = false;
}

class ConceptQuestionBlock extends Block {
  static type = 'concept_question';

  conceptQuestionSlug?: string;
  isInteractable = true;
}

export { ClickToContinueBlock, MarkdownBlock, ConceptQuestionBlock, ConceptAnimationBlock };
