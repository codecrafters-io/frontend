import Component from '@glimmer/component';
import ConceptModel, { Block } from 'codecrafters-frontend/models/concept';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    concept: ConceptModel;
  };
};

export default class BlocksPageComponent extends Component<Signature> {
  @tracked blockChanges: Record<number, { oldBlock: Block; newBlock: Block }> = {};
  @tracked blockAdditions: Record<number, { anchorBlock: Block | null; newBlocks: Block[] }> = {};
  @tracked blockDeletions: Record<number, { oldBlock: Block }> = {};
  @tracked isSaving = false;

  @action
  handleAddedBlockChanged(anchorBlockIndex: number, addedBlockIndex: number, newBlock: Block) {
    this.blockAdditions[anchorBlockIndex]!.newBlocks[addedBlockIndex] = newBlock;
    this.blockAdditions = { ...this.blockAdditions }; // Force re-render
  }

  @action
  handleAddedBlockDeleted(anchorBlockIndex: number, addedBlockIndex: number) {
    this.blockAdditions[anchorBlockIndex]!.newBlocks.splice(addedBlockIndex, 1);
    this.blockAdditions = { ...this.blockAdditions }; // Force re-render
  }

  @action
  handleBlockAdded(anchorBlockIndex: number, insertAtIndex: number, newBlock: Block) {
    if (this.blockAdditions[anchorBlockIndex]) {
      this.blockAdditions[anchorBlockIndex]!.newBlocks.splice(insertAtIndex, 0, newBlock);
    } else {
      if (insertAtIndex !== 0) {
        throw new Error('Expected indexWithinAddition to be 0 when adding a new blockAddition');
      }

      // anchorBlock is null if the block is being added at the start of the list
      this.blockAdditions[anchorBlockIndex] = { anchorBlock: this.args.concept.parsedBlocks[anchorBlockIndex] || null, newBlocks: [newBlock] };
    }

    this.blockAdditions = { ...this.blockAdditions }; // Force re-render
  }

  @action
  handleBlockChanged(index: number, newBlock: Block) {
    const oldBlock = this.args.concept.parsedBlocks[index]!;

    if (newBlock.isEqual(oldBlock)) {
      delete this.blockChanges[index];
    } else {
      this.blockChanges[index] = {
        oldBlock: this.args.concept.parsedBlocks[index]!,
        newBlock: newBlock,
      };
    }

    this.blockChanges = { ...this.blockChanges }; // Force re-render
  }

  @action
  handleBlockChangeDiscarded(index: number) {
    delete this.blockChanges[index];

    this.blockChanges = { ...this.blockChanges }; // Force re-render
  }

  @action
  handleBlockDeletionDiscarded(index: number) {
    delete this.blockDeletions[index];

    this.blockDeletions = { ...this.blockDeletions }; // Force re-render
  }

  @action
  handleBlockDeleted(index: number) {
    this.blockDeletions[index] = {
      oldBlock: this.args.concept.parsedBlocks[index]!,
    };

    if (this.blockChanges[index]) {
      delete this.blockChanges[index];
    }

    this.blockChanges = { ...this.blockChanges }; // Force re-render
    this.blockDeletions = { ...this.blockDeletions }; // Force re-render
  }

  get numberOfBlockAdditions(): number {
    return Object.entries(this.blockAdditions).reduce<number>((sum, [_, addition]) => sum + addition.newBlocks.length, 0);
  }

  get numberOfBlockChanges() {
    return Object.keys(this.blockChanges).length;
  }

  get numberOfBlockDeletions() {
    return Object.keys(this.blockDeletions).length;
  }

  get blocksWithMetadata() {
    return this.args.concept.parsedBlocks.map((block, index) => {
      const wasChanged = !!this.blockChanges[index];
      const wasDeleted = !!this.blockDeletions[index];

      let changeIsStale = false;

      if (wasChanged) {
        changeIsStale = !this.blockChanges[index]!.oldBlock.isEqual(block);
      }

      if (wasDeleted) {
        changeIsStale = !this.blockDeletions[index]!.oldBlock.isEqual(block);
      }

      return {
        block: this.blockChanges[index]?.newBlock || block,
        changeIsStale: changeIsStale,
        wasChanged: wasChanged,
        wasDeleted: wasDeleted,
        addedBlocks: this.blockAdditions[index]?.newBlocks || [],
      };
    });
  }

  get changesArePresent() {
    return this.numberOfBlockAdditions > 0 || this.numberOfBlockChanges > 0 || this.numberOfBlockDeletions > 0;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptAdmin::BlocksPage': typeof BlocksPageComponent;
  }
}
