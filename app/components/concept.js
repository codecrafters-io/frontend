import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import move from 'ember-animated/motions/move';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';

export default class ConceptComponent extends Component {
  @tracked lastRevealedBlockIndex = null;

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
    if (this.nextUnrevealedBlockThatNeedsInteraction) {
      this.updateLastRevealedBlockIndex(this.nextUnrevealedBlockThatNeedsInteraction.index);
    } else {
      this.updateLastRevealedBlockIndex(this.lastBlockIndex);
    }
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
    return Math.round(100 * ((this.currentBlockIndex + 1) / this.allBlocks.length));
  }

  get revealedBlocks() {
    return this.allBlocks.slice(0, (this.currentBlockIndex || this.initialBlockIndex) + 1);
  }

  updateLastRevealedBlockIndex(newBlockIndex) {
    this.lastRevealedBlockIndex = newBlockIndex;
    this.args.onProgressPercentageChange(this.progressPercentage);
  }

  get visibleBlocks() {
    return this.revealedBlocks.reject((block) => block.type === 'click_to_continue' && block.index !== this.currentBlockIndex);
  }
}
