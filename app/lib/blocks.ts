import { tracked } from '@glimmer/tracking';
import type { BlockJSON } from 'codecrafters-frontend/models/concept';

class Block {
  @tracked type: BlockJSON['type'];
  @tracked args: Record<string, unknown>;

  constructor(json: BlockJSON) {
    this.type = json.type;
    this.args = { ...json.args }; // Don't mutate the original JSON
  }

  get toJSON(): BlockJSON {
    return {
      type: this.type,
      args: { ...this.args },
    };
  }

  dup(): this {
    return new (this.constructor as typeof Block)(this.toJSON) as this;
  }

  isEqual(other: Block): boolean {
    return JSON.stringify(this.toJSON) === JSON.stringify(other.toJSON);
  }

  updateArgs(key: string, value: unknown) {
    this.args = { ...this.args, [key]: value };
  }
}

class ClickToContinueBlock extends Block {
  static type = 'click_to_continue';
  isInteractable = true;

  declare args: {
    button_text?: string;
  };

  get buttonText(): string | undefined {
    return this.args.button_text;
  }

  get buttonTextForDisplay(): string {
    return this.buttonText || 'Continue';
  }

  set buttonText(buttonText: string) {
    this.updateArgs('button_text', buttonText);
  }
}

class MarkdownBlock extends Block {
  static type = 'markdown';
  isInteractable = false;

  declare args: {
    markdown: string;
  };

  get markdown() {
    return this.args.markdown;
  }

  set markdown(markdown: string) {
    this.updateArgs('markdown', markdown);
  }
}

class ConceptAnimationBlock extends Block {
  static type = 'concept_animation';
  isInteractable = false;

  declare args: {
    concept_animation_slug: string;
  };

  get conceptAnimationSlug() {
    return this.args.concept_animation_slug;
  }
}

class ConceptQuestionBlock extends Block {
  static type = 'concept_question';
  isInteractable = true;

  declare args: {
    concept_question_slug: string;
  };

  get conceptQuestionSlug() {
    return this.args.concept_question_slug;
  }
}

function IsClickToContinueBlock(block: Block): block is ClickToContinueBlock {
  return block.type === ClickToContinueBlock.type;
}

function IsMarkdownBlock(block: Block): block is MarkdownBlock {
  return block.type === MarkdownBlock.type;
}

function IsConceptAnimationBlock(block: Block): block is ConceptAnimationBlock {
  return block.type === 'concept_animation';
}

function IsConceptQuestionBlock(block: Block): block is ConceptQuestionBlock {
  return block.type === 'concept_question';
}

export {
  ClickToContinueBlock,
  MarkdownBlock,
  ConceptQuestionBlock,
  ConceptAnimationBlock,
  IsClickToContinueBlock,
  IsMarkdownBlock,
  IsConceptAnimationBlock,
  IsConceptQuestionBlock,
};
