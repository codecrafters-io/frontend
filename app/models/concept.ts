import ConceptQuestion from 'codecrafters-frontend/models/concept-question';
import Model from '@ember-data/model';
import showdown from 'showdown';
import { attr, hasMany, type SyncHasMany } from '@ember-data/model';
import { htmlSafe } from '@ember/template';
import { MarkdownBlock, ConceptAnimationBlock, ClickToContinueBlock, ConceptQuestionBlock } from 'codecrafters-frontend/lib/blocks';
import { SafeString } from '@ember/template/-private/handlebars';

export type Block = MarkdownBlock | ConceptAnimationBlock | ClickToContinueBlock | ConceptQuestionBlock;

type BlockJSON = {
  type: string,
  args?: any
}

export default class Concept extends Model {
  @hasMany('concept-question', { async: false }) declare questions: SyncHasMany<ConceptQuestion>;

  @attr('string') declare descriptionMarkdown: string;
  @attr() declare blocks: Array<BlockJSON>;
  @attr('string') declare slug: string;
  @attr('string') declare title: string;
  @attr('date') declare updatedAt: Date;

  get descriptionHTML(): SafeString | null {
    if (this.descriptionMarkdown) {
      return htmlSafe(new showdown.Converter({ openLinksInNewWindow: true }).makeHtml(this.descriptionMarkdown));
    } else {
      return null;
    }
  }

  get parsedBlocks(): Block[] {
    type BlockClass = typeof MarkdownBlock | typeof ConceptQuestionBlock | typeof ClickToContinueBlock | typeof ConceptAnimationBlock;
    type BlockClassMapping = Record<string, BlockClass>;

    const blockClasses = [MarkdownBlock, ConceptQuestionBlock, ClickToContinueBlock, ConceptAnimationBlock];

    const blockTypeMapping = blockClasses.reduce<BlockClassMapping>((mapping, blockClass) => {
      mapping[blockClass.type] = blockClass;

      return mapping;
    }, {} as BlockClassMapping);

    return this.blocks.map((blockJSON: BlockJSON) => {
      const blockClass = blockTypeMapping[blockJSON.type];

      if (!blockClass) {
        throw new Error(`Unknown block type: ${blockJSON.type}`);
      }

      return blockClass.fromJSON(blockJSON.args);
    });
  }
}
