import Component from '@glimmer/component';
import { Block } from 'codecrafters-frontend/models/concept';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { next } from '@ember/runloop';
import { ClickToContinueBlock, ConceptQuestionBlock, MarkdownBlock } from 'codecrafters-frontend/lib/blocks';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    conceptBlock: Block;
    wasAdded: boolean;
    wasChanged: boolean;
    wasDeleted: boolean;
    onBlockChanged: (newBlock: Block) => void;
    onBlockDeleted: () => void;
    onBlockChangeDiscarded: () => void;
  };
};

export default class EditableBlockComponent extends Component<Signature> {
  @tracked mutableBlock: Block | null = null;

  get blockOrMutableBlock(): Block {
    return this.mutableBlock || this.args.conceptBlock;
  }

  get blockOrMutableBlockAsConceptQuestionBlock() {
    return this.blockOrMutableBlock as ConceptQuestionBlock;
  }

  get isEditing() {
    return !!this.mutableBlock;
  }

  // Glint can't infer the type, so we add a getter for each block type
  get mutableBlockAsClickToContinueBlock() {
    return this.mutableBlock as ClickToContinueBlock;
  }

  get mutableBlockAsConceptQuestionBlock() {
    return this.mutableBlock as ConceptQuestionBlock;
  }

  // Glint can't infer the type, so we add a getter for each block type
  get mutableBlockAsMarkdownBlock() {
    return this.mutableBlock as MarkdownBlock;
  }

  get mutableBlockHasChanges() {
    return this.mutableBlock && !this.mutableBlock.isEqual(this.args.conceptBlock);
  }

  get shouldShowDiscardChangesButton() {
    return this.isEditing && (this.mutableBlockHasChanges || this.args.wasChanged);
  }

  abortEditing() {
    this.mutableBlock = null;
  }

  finishEditing() {
    if (this.mutableBlock) {
      this.args.onBlockChanged(this.mutableBlock);
    }

    this.mutableBlock = null;
  }

  @action
  handleCancelButtonClicked() {
    // Ensure the click handler for the outer block doesn't interfere
    next(() => {
      this.abortEditing();
    });
  }

  @action
  handleCollapsedBlockClicked() {
    if (!this.isEditing) {
      this.startEditing();
    }
  }

  @action
  handleDeleteButtonClicked() {
    this.args.onBlockDeleted();

    // Ensure the click handler for the outer block doesn't interfere
    next(() => {
      this.abortEditing();
    });
  }

  @action
  handleDiscardChangesButtonClicked() {
    this.args.onBlockChangeDiscarded();

    // Ensure the click handler for the outer block doesn't interfere
    next(() => {
      this.abortEditing();
    });
  }

  @action
  handleSaveButtonClicked() {
    // Ensure the click handler for the outer block doesn't interfere
    next(() => {
      this.finishEditing();
    });
  }

  startEditing() {
    this.mutableBlock = this.args.conceptBlock.dup();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptAdmin::BlocksPage::EditableBlock': typeof EditableBlockComponent;
  }
}
