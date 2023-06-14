import { camelize } from '@ember/string';

class Block {
  static fromJSON(json) {
    const block = new this();

    for (const [key, value] of Object.entries(json)) {
      block[camelize(key)] = value;
    }

    return block;
  }

  get type() {
    return this.constructor.type;
  }
}

class ClickToContinueBlock extends Block {
  static type = 'click_to_continue';

  buttonText = 'Continue';
  isInteractable = true;
}

class MarkdownBlock extends Block {
  static type = 'markdown';

  markdown;
  isInteractable = false;
}

class ConceptAnimationBlock extends Block {
  static type = 'concept_animation';

  conceptAnimationSlug;
  isInteractable = false;
}

class ConceptQuestionBlock extends Block {
  static type = 'concept_question';

  conceptQuestionSlug;
  isInteractable = true;
}

export { ClickToContinueBlock, MarkdownBlock, ConceptQuestionBlock, ConceptAnimationBlock };
