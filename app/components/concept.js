import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { cached } from '@glimmer/tracking';

export default class ConceptComponent extends Component {
  @service store;

  @tracked lastRevealedBlockGroupIndex = null;
  @tracked hasFinished = false;

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

  @cached
  get allBlockGroups() {
    return this.allBlocks.reduce((groups, block) => {
      if (groups.length === 0) {
        groups.push({ index: 0, blocks: [] });
      }

      groups[groups.length - 1].blocks.push(block);

      if (block.isInteractable || groups.length === 0) {
        groups.push({ index: groups.length, blocks: [] });
      }

      return groups;
    }, []);
  }

  get completedBlocksCount() {
    return this.allBlockGroups.reduce((count, blockGroup) => {
      if (blockGroup.index < this.currentBlockGroupIndex) {
        count += blockGroup.blocks.length;
      }

      return count;
    }, 0);
  }

  get currentBlockGroupIndex() {
    return this.lastRevealedBlockGroupIndex || 0;
  }

  @action
  handleBlockGroupContainerInserted(blockGroup, containerElement) {
    if (blockGroup.index === this.lastRevealedBlockGroupIndex) {
      containerElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
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

  @action
  handleContinueButtonClick() {
    if (this.currentBlockGroupIndex === this.allBlockGroups.length - 1) {
      this.hasFinished = true;
    } else {
      this.updateLastRevealedBlockGroupIndex(this.currentBlockGroupIndex + 1);
    }

    this.store
      .createRecord('analytics-event', {
        name: 'progressed_through_concept',
        properties: { concept_id: this.args.concept.id, progress_percentage: this.progressPercentage },
      })
      .save();
  }

  get progressPercentage() {
    if (!this.lastRevealedBlockGroupIndex) {
      return 0; // The user hasn't interacted with any blocks yet
    }

    if (this.hasFinished) {
      return 100;
    } else {
      return Math.round(100 * (this.completedBlocksCount / this.allBlocks.length));
    }
  }

  get visibleBlockGroups() {
    return this.allBlockGroups.slice(0, (this.lastRevealedBlockGroupIndex || 0) + 1);
  }

  updateLastRevealedBlockGroupIndex(newBlockGroupIndex) {
    this.lastRevealedBlockGroupIndex = newBlockGroupIndex;
    this.args.onProgressPercentageChange(this.progressPercentage);
  }
}
