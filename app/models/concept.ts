import ConceptQuestion from 'codecrafters-frontend/models/concept-question';
import Model from '@ember-data/model';
import showdown from 'showdown';
import { attr, hasMany, type SyncHasMany } from '@ember-data/model';
import { htmlSafe } from '@ember/template';
import { MarkdownBlock, ConceptAnimationBlock, ClickToContinueBlock, ConceptQuestionBlock } from 'codecrafters-frontend/lib/blocks';

type BlockJSON = {
  type: string,
  args?: any
}

type BlockClass = typeof MarkdownBlock | typeof ConceptQuestionBlock | typeof ClickToContinueBlock | typeof ConceptAnimationBlock;

type BlockTypeMapping = Record<string, BlockClass>;

export default class Concept extends Model {
  @hasMany('concept-question', { async: false }) 
  declare questions: SyncHasMany<ConceptQuestion>;
  @attr('string')
  declare descriptionMarkdown: string;
  @attr() 
  declare blocks: Array<BlockClass>;
  @attr('string')
  declare slug: string;
  @attr('string')
  declare title: string;
  @attr('date')
  declare updatedAt: Date;

  get descriptionHTML() {
    if (this.descriptionMarkdown) {
      return htmlSafe(new showdown.Converter({ openLinksInNewWindow: true }).makeHtml(this.descriptionMarkdown));
    } else {
      return null;
    }
  }

  get parsedBlocks() {
    const blockClasses = [MarkdownBlock, ConceptQuestionBlock, ClickToContinueBlock, ConceptAnimationBlock];

    const blockTypeMapping = blockClasses.reduce<BlockTypeMapping>((mapping, blockClass) => {
      mapping[blockClass.type] = blockClass;

      return mapping;
    }, {} as BlockTypeMapping);

    return this.blocks.map((blockJSON: BlockJSON) => {

      const blockClass = blockTypeMapping[blockJSON.type];

      if (!blockClass) {
        throw new Error(`Unknown block type: ${blockJSON.type}`);
      }

      return blockClass.fromJSON(blockJSON.args);
    });
  }
}
