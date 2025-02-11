import ConceptModel, { type BlockGroup } from 'codecrafters-frontend/models/concept';
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
    const completedBlocksCount = Math.round((this.currentProgressPercentage / 100) * this.totalBlocksCount);

    return this.convertBlockProgressIntoBlockGroupProgress(this.concept.allBlockGroups, completedBlocksCount);
  }

  get totalBlockGroupsCount() {
    return this.concept.allBlockGroups.length;
  }

  get totalBlocksCount() {
    return this.concept.parsedBlocks.length;
  }

  convertBlockProgressIntoBlockGroupProgress(allBlockGroups: BlockGroup[], completedBlocksCount: number) {
    let completedBlockGroups = 0;

    for (const blockGroup of allBlockGroups) {
      completedBlockGroups += blockGroup.blocks.length;

      if (completedBlocksCount <= completedBlockGroups) {
        return blockGroup.index + 2;
      }
    }

    return allBlockGroups.length;
  }
}
