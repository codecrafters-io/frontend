import Concept from 'codecrafters-frontend/models/concept';
import Model from '@ember-data/model';
import showdown from 'showdown';
import { attr, belongsTo } from '@ember-data/model';
import { htmlSafe } from '@ember/template';
import { SafeString } from '@ember/template/-private/handlebars';
import { ConceptQuestionBlock } from 'codecrafters-frontend/lib/blocks';

type Option = {
  markdown: string;
  is_correct: boolean;
  explanation_markdown: string;
};

export default class ConceptQuestionModel extends Model {
  @belongsTo('concept', { async: false }) declare concept: Concept;
  @attr('string') declare queryMarkdown: string;
  @attr('string') declare slug: string;
  @attr() declare options: Array<Option>;

  get blockForPreview(): ConceptQuestionBlock {
    return new ConceptQuestionBlock({
      type: 'concept_question',
      args: {
        concept_question_slug: this.slug,
      },
    });
  }

  get correctOptionIndex(): number {
    return this.options.findIndex((option) => option.is_correct);
  }

  get queryHTML(): SafeString | null {
    if (this.queryMarkdown) {
      return htmlSafe(new showdown.Converter({ openLinksInNewWindow: true }).makeHtml(this.queryMarkdown));
    } else {
      return null;
    }
  }
}
