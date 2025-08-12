import ConceptEngagementModel from 'codecrafters-frontend/models/concept-engagement';
import ConceptQuestion from 'codecrafters-frontend/models/concept-question';
import Model, { belongsTo } from '@ember-data/model';
import UserModel from 'codecrafters-frontend/models/user';
import {
  ClickToContinueBlockDefinition,
  ConceptAnimationBlockDefinition,
  ConceptQuestionBlockDefinition,
  MarkdownBlockDefinition,
} from 'codecrafters-frontend/utils/block-definitions';
import { type SyncHasMany, attr, hasMany } from '@ember-data/model';
import { equal } from '@ember/object/computed'; // eslint-disable-line ember/no-computed-properties-in-native-classes
import { memberAction } from 'ember-api-actions';

export type BlockDefinition =
  | MarkdownBlockDefinition
  | ConceptAnimationBlockDefinition
  | ClickToContinueBlockDefinition
  | ConceptQuestionBlockDefinition;

export type BlockJSON = {
  type: 'click_to_continue' | 'markdown' | 'concept_animation' | 'concept_question';
  args: Record<string, unknown>;
};

export interface BlockGroup {
  index: number;
  blocks: BlockDefinition[];
}

export default class ConceptModel extends Model {
  @belongsTo('user', { async: false, inverse: null }) declare author: UserModel;

  @hasMany('concept-engagement', { async: false, inverse: 'concept' }) declare engagements: ConceptEngagementModel[];
  @hasMany('concept-question', { async: false, inverse: 'concept' }) declare questions: SyncHasMany<ConceptQuestion>;

  @attr() declare blocks: Array<BlockJSON>;
  @attr('string') declare descriptionMarkdown: string;
  @attr('string') declare slug: string;
  @attr('string') declare status: 'draft' | 'published';
  @attr('string') declare title: string;
  @attr('date') declare createdAt: Date;

  @equal('status', 'draft') declare statusIsDraft: boolean;
  @equal('status', 'published') declare statusIsPublished: boolean;

  get blockGroups(): BlockGroup[] {
    return this.parsedBlocks.reduce((groups, block, index) => {
      if (groups.length <= 0) {
        groups.push({ index: 0, blocks: [] });
      }

      (groups[groups.length - 1] as BlockGroup).blocks.push(block);

      const isLastBlock = index === this.parsedBlocks.length - 1;

      if (block.isInteractable && !isLastBlock) {
        groups.push({ index: groups.length, blocks: [] });
      }

      return groups;
    }, [] as BlockGroup[]);
  }

  get estimatedReadingTimeInMinutes(): number {
    if (this.blocks) {
      return Math.round((this.blocks.length * 10) / 60);
    } else {
      return 5;
    }
  }

  get lastPersistedSlug(): string {
    if (this.changedAttributes()['slug'] && !this.hasDirtyAttributes) {
      return this.changedAttributes()['slug']![1];
    } else if (this.changedAttributes()['slug']) {
      return this.changedAttributes()['slug']![0];
    } else {
      return this.slug;
    }
  }

  get parsedBlocks(): BlockDefinition[] {
    const blockClassMapping: Record<string, unknown> = {};

    const blockClasses = [ClickToContinueBlockDefinition, MarkdownBlockDefinition, ConceptAnimationBlockDefinition, ConceptQuestionBlockDefinition];

    blockClasses.forEach((blockClass) => {
      blockClassMapping[blockClass.type] = blockClass;
    });

    return this.blocks.map((blockJSON) => {
      const blockClass = blockClassMapping[blockJSON.type] as new (json: BlockJSON) => BlockDefinition;

      if (!blockClass) {
        throw new Error(`Unknown block type: ${blockJSON.type}`);
      }

      return new blockClass(blockJSON);
    });
  }

  get url(): string {
    return `https://app.codecrafters.io/concepts/${this.slug}`;
  }

  declare updateBlocks: (this: Model, payload: unknown) => Promise<void>;
}

ConceptModel.prototype.updateBlocks = memberAction({
  path: 'update-blocks',
  type: 'post',

  after(response) {
    this.store.pushPayload(response);
  },
});
