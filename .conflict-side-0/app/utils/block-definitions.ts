import { tracked } from '@glimmer/tracking';
import type { BlockJSON } from 'codecrafters-frontend/models/concept';

class BlockDefinition {
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
    return new (this.constructor as typeof BlockDefinition)(this.toJSON) as this;
  }

  isEqual(other: BlockDefinition): boolean {
    return JSON.stringify(this.toJSON) === JSON.stringify(other.toJSON);
  }

  updateArgs(key: string, value: unknown) {
    this.args = { ...this.args, [key]: value };
  }
}

export class ClickToContinueBlockDefinition extends BlockDefinition {
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

export class MarkdownBlockDefinition extends BlockDefinition {
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

export class ConceptAnimationBlockDefinition extends BlockDefinition {
  static type = 'concept_animation';
  isInteractable = false;

  declare args: {
    concept_animation_slug: string;
  };

  get conceptAnimationSlug() {
    return this.args.concept_animation_slug;
  }
}

export class ConceptQuestionBlockDefinition extends BlockDefinition {
  static type = 'concept_question';
  isInteractable = true;

  declare args: {
    concept_question_slug: string;
  };

  get conceptQuestionSlug() {
    return this.args.concept_question_slug;
  }

  set conceptQuestionSlug(slug: string) {
    this.updateArgs('concept_question_slug', slug);
  }
}

export function IsClickToContinueBaseBlock(block: BlockDefinition): block is ClickToContinueBlockDefinition {
  return block.type === ClickToContinueBlockDefinition.type;
}

export function IsMarkdownBaseBlock(block: BlockDefinition): block is MarkdownBlockDefinition {
  return block.type === MarkdownBlockDefinition.type;
}

export function IsConceptAnimationBaseBlock(block: BlockDefinition): block is ConceptAnimationBlockDefinition {
  return block.type === 'concept_animation';
}

export function IsConceptQuestionBaseBlock(block: BlockDefinition): block is ConceptQuestionBlockDefinition {
  return block.type === 'concept_question';
}
