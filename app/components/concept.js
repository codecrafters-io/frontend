import Component from '@glimmer/component';
import move from 'ember-animated/motions/move';
import { TrackedSet } from 'tracked-built-ins';
import { action } from '@ember/object';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { cached } from '@glimmer/tracking';

export default class ConceptComponent extends Component {
  @service store;

  @tracked lastRevealedBlockIndex = null;
  @tracked interactedBlockIndexes = new TrackedSet([]);

  @cached
  get allBlocks() {
    return this.args.concept.parsedBlocks.map((block, index) => {
      return {
        ...block,
        type: block.type,
        index: index,
      };
    });
  }

  get currentBlockIndex() {
    return this.lastRevealedBlockIndex || this.initialBlockIndex;
  }

  @action
  handleDidInsertContainer() {
    this.store
      .createRecord('analytics-event', {
        name: 'viewed_concept',
        properties: { concept_id: this.args.concept.id },
      })
      .save();
  }

  get unrevealedBlocks() {
    return this.allBlocks.slice(this.currentBlockIndex + 1);
  }

  get nextUnrevealedBlockThatNeedsInteraction() {
    return this.unrevealedBlocks.find((block) => block.type === 'concept_question' || block.type === 'click_to_continue');
  }

  get lastBlockIndex() {
    return this.allBlocks.length - 1;
  }

  @action
  handleContinueButtonClick() {
    this.interactedBlockIndexes.add(this.currentBlockIndex);

    if (this.nextUnrevealedBlockThatNeedsInteraction) {
      this.updateLastRevealedBlockIndex(this.nextUnrevealedBlockThatNeedsInteraction.index);
    } else {
      this.updateLastRevealedBlockIndex(this.lastBlockIndex);
    }

    this.store
      .createRecord('analytics-event', {
        name: 'progressed_through_concept',
        properties: { concept_id: this.args.concept.id, progress_percentage: this.progressPercentage },
      })
      .save();
  }

  get lastInteractedBlock() {
    return this.allBlocks.findLast((block) => this.interactedBlockIndexes.has(block.index));
  }

  get lastInteractableBlock() {
    return this.allBlocks.findLast((block) => block.type === 'concept_question' || block.type === 'click_to_continue');
  }

  get initialBlockIndex() {
    const firstClickToContinueBlock = this.allBlocks.find((block) => block.type === 'click_to_continue');

    return firstClickToContinueBlock ? firstClickToContinueBlock.index : this.allBlocks.length - 1;
  }

  // eslint-disable-next-line require-yield
  *listTransition({ duration, insertedSprites, keptSprites, removedSprites }) {
    for (let sprite of keptSprites) {
      move(sprite, { duration });
    }

    for (let sprite of insertedSprites) {
      fadeIn(sprite, { duration });
    }

    for (let sprite of removedSprites) {
      fadeOut(sprite, { duration });
    }
  }

  get progressPercentage() {
    if (!this.lastInteractableBlock) {
      return 100; // We can't calculate progress unless there's at least one interactable block
    }

    if (!this.lastInteractedBlock) {
      return 0; // The user hasn't interacted with any blocks yet
    }

    if (this.lastInteractedBlock.index === this.lastInteractableBlock.index) {
      return 100;
    } else {
      return Math.round(100 * ((this.lastInteractedBlock.index + 1) / this.allBlocks.length));
    }
  }

  get revealedBlocks() {
    return this.allBlocks.slice(0, (this.currentBlockIndex || this.initialBlockIndex) + 1);
  }

  updateLastRevealedBlockIndex(newBlockIndex) {
    this.lastRevealedBlockIndex = newBlockIndex;
    this.args.onProgressPercentageChange(this.progressPercentage);
  }

  get visibleBlocks() {
    return this.revealedBlocks.reject((block) => block.type === 'click_to_continue' && this.interactedBlockIndexes.has(block.index));
  }
}
