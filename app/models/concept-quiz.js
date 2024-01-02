import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

export default class ConceptQuiz extends Model {
  @belongsTo('concept', { async: false, inverse: null }) concept;
  @attr('string') queryMarkdown;
  @attr('') options; // free-form JSON: { "markdown": String, "is_correct": true/false, "explanation_markdown": String }

  get correctOptionIndex() {
    return this.options.findIndex((option) => option.is_correct);
  }
}
