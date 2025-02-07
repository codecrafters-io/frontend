import ConceptModel, { type Block, type BlockGroup } from 'codecrafters-frontend/models/concept';
import UserModel from 'codecrafters-frontend/models/user';
import Model, { attr, belongsTo } from '@ember-data/model';

export default class ConceptEngagementModel extends Model {
  @belongsTo('concept', { async: false, inverse: 'engagements' }) declare concept: ConceptModel;
  @belongsTo('user', { async: false, inverse: 'conceptEngagements' }) declare user: UserModel;
  @attr('date') declare completedAt?: Date;
  @attr('number') declare currentProgressPercentage: number;
  @attr('date') declare lastActivityAt: Date;
  @attr('date') declare startedAt: Date;

  get completedBlockGroupsCount() {
    const completedBlocksIndex = Math.round((this.currentProgressPercentage / 100) * this.totalBlocksCount);

    return this.parseIntoBlockGroups(this.concept.parsedBlocks.slice(0, completedBlocksIndex)).length;
  }

  get totalBlockGroupsCount() {
    return this.parseIntoBlockGroups(this.concept.parsedBlocks).length;
  }

  get totalBlocksCount() {
    return this.concept.parsedBlocks.length;
  }

  parseIntoBlockGroups(blocks: Block[]): BlockGroup[] {
    return blocks.reduce((groups, block) => {
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
}
