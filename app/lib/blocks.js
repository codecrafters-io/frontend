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
}

class MarkdownBlock extends Block {
  static type = 'markdown';

  markdown;
}

class ConceptAnimationBlock extends Block {
  static type = 'concept_animation';

  conceptAnimationSlug;
}

class ConceptQuestionBlock extends Block {
  static type = 'concept_question';

  conceptQuestionSlug;
}

export { ClickToContinueBlock, MarkdownBlock, ConceptQuestionBlock, ConceptAnimationBlock };
