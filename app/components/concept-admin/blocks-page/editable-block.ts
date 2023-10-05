import Component from '@glimmer/component';
import { Block } from 'codecrafters-frontend/models/concept';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { next } from '@ember/runloop';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    conceptBlock: Block;
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

  get isEditing() {
    return !!this.mutableBlock;
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

  @action
  handleCollapsedBlockClicked() {
    if (!this.isEditing) {
      this.startEditing();
    }
  }

  @action
  handleSaveButtonClicked() {
    // Ensure the click handler for the outer block doesn't interfere
    next(() => {
      this.finishEditing();
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

  startEditing() {
    this.mutableBlock = this.args.conceptBlock.dup();
  }

  finishEditing() {
    if (this.mutableBlock) {
      this.args.onBlockChanged(this.mutableBlock);
    }

    this.mutableBlock = null;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptAdmin::BlocksPage::EditableBlock': typeof EditableBlockComponent;
  }
}
