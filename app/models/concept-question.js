import { attr, belongsTo } from '@ember-data/model';
import { htmlSafe } from '@ember/template';
import Model from '@ember-data/model';
import showdown from 'showdown';

export default class ConceptQuestion extends Model {
  @belongsTo('concept', { async: false }) concept;
  @attr('string') questionMarkdown;
  @attr('') options; // free-form JSON: { "markdown": String, "is_correct": true/false, "explanation_markdown": String }

  get correctOptionIndex() {
    return this.options.findIndex((option) => option.is_correct);
  }

  get questionHTML() {
    if (this.questionMarkdown) {
      return htmlSafe(new showdown.Converter({ openLinksInNewWindow: true }).makeHtml(this.questionMarkdown));
    } else {
      return null;
    }
  }
}
