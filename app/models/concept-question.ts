import Concept from 'codecrafters-frontend/models/concept';
import Model, { attr, belongsTo } from '@ember-data/model';
import { ConceptQuestionBlockDefinition } from 'codecrafters-frontend/utils/block-definitions';

export type Option = {
  markdown: string;
  is_correct: boolean;
  explanation_markdown: string;
};

export default class ConceptQuestionModel extends Model {
  @belongsTo('concept', { async: false, inverse: 'questions' }) declare concept: Concept;
  @attr('string') declare queryMarkdown: string;
  @attr('string') declare slug: string;
  @attr() declare options: Array<Option>;

  get blockForPreview(): ConceptQuestionBlockDefinition {
    return new ConceptQuestionBlockDefinition({
      type: 'concept_question',
      args: {
        concept_question_slug: this.slug,
      },
    });
  }

  get correctOptionIndex(): number {
    return this.options.findIndex((option) => option.is_correct);
  }
}
