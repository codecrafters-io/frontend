import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

import type ConceptModel from 'codecrafters-frontend/models/concept';
import type { Option } from 'codecrafters-frontend/models/concept-question';

export default class ConceptQuiz extends Model {
  @attr() declare options: Array<Option>; // free-form JSON: { "markdown": String, "is_correct": true/false, "explanation_markdown": String }
  @attr('string') declare queryMarkdown: string;

  @belongsTo('concept', { async: false, inverse: null }) declare concept: ConceptModel;

  get correctOptionIndex() {
    return this.options.findIndex((option) => option.is_correct);
  }
}
