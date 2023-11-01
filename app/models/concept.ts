import ConceptQuestion from 'codecrafters-frontend/models/concept-question';
import Model, { belongsTo } from '@ember-data/model';
import { Block, MarkdownBlock, ConceptAnimationBlock, ClickToContinueBlock, ConceptQuestionBlock } from 'codecrafters-frontend/lib/blocks';
import { attr, hasMany, type SyncHasMany } from '@ember-data/model';
import { memberAction } from 'ember-api-actions';
import { TemporaryUserModel } from './temporary-types';

export type BlockJSON = {
  type: 'click_to_continue' | 'markdown' | 'concept_animation' | 'concept_question';
  args: Record<string, unknown>;
};

export default class ConceptModel extends Model {
  @belongsTo('user', { async: false }) declare author: TemporaryUserModel;

  @hasMany('concept-question', { async: false }) declare questions: SyncHasMany<ConceptQuestion>;

  @attr('string') declare descriptionMarkdown: string;
  @attr() declare blocks: Array<BlockJSON>;
  @attr('string') declare slug: string;
  @attr('string') declare title: string;
  @attr('date') declare updatedAt: Date;

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

  get parsedBlocks(): Block[] {
    const blockClassMapping: Record<string, unknown> = {};

    const blockClasses = [ClickToContinueBlock, MarkdownBlock, ConceptAnimationBlock, ConceptQuestionBlock];

    blockClasses.forEach((blockClass) => {
      blockClassMapping[blockClass.type] = blockClass;
    });

    return this.blocks.map((blockJSON) => {
      const blockClass = blockClassMapping[blockJSON.type] as new (json: BlockJSON) => Block;

      if (!blockClass) {
        throw new Error(`Unknown block type: ${blockJSON.type}`);
      }

      return new blockClass(blockJSON);
    });
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
