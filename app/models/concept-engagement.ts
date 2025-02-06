import ConceptModel, { type Block } from 'codecrafters-frontend/models/concept';
import UserModel from 'codecrafters-frontend/models/user';
import Model, { attr, belongsTo } from '@ember-data/model';
import { cached, tracked } from '@glimmer/tracking';

export interface BlockGroup {
  index: number;
  blocks: Block[];
}

export default class ConceptEngagementModel extends Model {
  @belongsTo('concept', { async: false, inverse: 'engagements' }) declare concept: ConceptModel;
  @belongsTo('user', { async: false, inverse: 'conceptEngagements' }) declare user: UserModel;
  @attr('date') declare completedAt?: Date;
  @attr('number') declare currentProgressPercentage: number;
  @attr('date') declare lastActivityAt: Date;
  @attr('date') declare startedAt: Date;

  // This needs to be updated on button clicks
  @tracked lastRevealedBlockGroupIndex: number | null = null;

  get currentBlockGroupIndex() {
    return this.lastRevealedBlockGroupIndex || 0;
  }

  get completedBlocksCount() {
    return this.allBlockGroups.reduce((count, blockGroup) => {
      if (blockGroup.index < this.currentBlockGroupIndex) {
        count += blockGroup.blocks.length;
      }

      return count;
    }, 0);
  }

  @cached
  get allBlocks() {
    return this.concept.parsedBlocks;
  }

  @cached
  get allBlockGroups(): BlockGroup[] {
    return this.allBlocks.reduce((groups, block) => {
      if (groups.length <= 0) {
        groups.push({ index: 0, blocks: [] });
      }

      (groups[groups.length - 1] as BlockGroup).blocks.push(block);

      if (block.isInteractable || groups.length === 0) {
        groups.push({ index: groups.length, blocks: [] });
      }

      return groups;
    }, [] as BlockGroup[]);
  }

  get totalBlocksCount() {
    const allBlocks = this.allBlockGroups;

    return allBlocks.length;
  }
}
