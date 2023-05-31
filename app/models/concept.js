import { attr, hasMany } from '@ember-data/model';
import { htmlSafe } from '@ember/template';
import Model from '@ember-data/model';
import showdown from 'showdown';
import { MarkdownBlock, ClickToContinueBlock, ConceptQuestionBlock } from 'codecrafters-frontend/lib/blocks';

export default class Concept extends Model {
  @hasMany('concept-question', { async: false }) questions;
  @attr('string') descriptionMarkdown;
  @attr('') blocks; // free-form JSON. [{ type: 'paragraph', args: { markdown: '...' } }]
  @attr('string') slug;
  @attr('string') title;
  @attr('date') updatedAt;

  get descriptionHTML() {
    if (this.descriptionMarkdown) {
      return htmlSafe(new showdown.Converter({ openLinksInNewWindow: true }).makeHtml(this.descriptionMarkdown));
    } else {
      return null;
    }
  }

  get parsedBlocks() {
    const blockClasses = [MarkdownBlock, ConceptQuestionBlock, ClickToContinueBlock];

    const blockTypeMapping = blockClasses.reduce((mapping, blockClass) => {
      mapping[blockClass.type] = blockClass;

      return mapping;
    }, {});

    return this.blocks.map((blockJSON) => {
      const blockClass = blockTypeMapping[blockJSON.type];

      if (!blockClass) {
        throw new Error(`Unknown block type: ${blockJSON.type}`);
      }

      return blockClass.fromJSON(blockJSON.args);
    });
  }
}
