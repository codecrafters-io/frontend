import Component from '@glimmer/component';
import ConceptModel, { Block } from 'codecrafters-frontend/models/concept';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { ClickToContinueBlock, ConceptQuestionBlock, MarkdownBlock } from 'codecrafters-frontend/lib/blocks';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    conceptBlock: Block;
    concept: ConceptModel;
    wasAdded: boolean;
    wasChanged: boolean;
    wasDeleted: boolean;
    onBlockChanged: (newBlock: Block) => void;
    onBlockDeleted: () => void;
    onBlockChangeDiscarded: () => void;
    onBlockDeletionDiscarded: () => void;
  };

  Blocks: {
    dragHandler: [];
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

  get previewBorderColorClasses() {
    if (this.args.wasDeleted) {
      return `border-red-500 hover:border-red-600`;
    } else if (this.args.wasAdded) {
      return `border-green-500 hover:border-green-600`;
    } else if (this.args.wasChanged) {
      return `border-yellow-500 hover:border-yellow-600`;
    } else {
      return `border-gray-200 hover:border-gray-300`;
    }
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
    this.abortEditing();
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
    this.abortEditing();
  }

  @action
  handleDiscardChangesButtonClicked() {
    this.args.onBlockChangeDiscarded();
    this.abortEditing();
  }

  @action
  handleSaveButtonClicked() {
    this.finishEditing();
  }

  @action
  handleUndeleteButtonClicked() {
    this.args.onBlockDeletionDiscarded();
    this.abortEditing();
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
