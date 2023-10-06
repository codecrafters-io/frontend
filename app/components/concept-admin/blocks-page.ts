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
  @tracked blockAdditions: Record<number, Block[]> = {};
  @tracked blockDeletions: Record<number, { oldBlock: Block }> = {};
  @tracked isSaving = false;

  @action
  handleBlockAdded(index: number, block: Block) {
    if (this.blockAdditions[index]) {
      this.blockAdditions[index]!.push(block);
    } else {
      this.blockAdditions[index] = [block];
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
    return Object.entries(this.blockAdditions).reduce<number>((sum, [_, addedBlocks]) => sum + addedBlocks.length, 0);
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
      };
    });
  }

  get changesArePresent() {
    return Object.keys(this.blockChanges).length > 0 || Object.keys(this.blockDeletions).length > 0;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptAdmin::BlocksPage': typeof BlocksPageComponent;
  }
}
