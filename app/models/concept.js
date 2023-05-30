import { attr, hasMany } from '@ember-data/model';
import { htmlSafe } from '@ember/template';
import Model from '@ember-data/model';
import showdown from 'showdown';

export default class Concept extends Model {
  @hasMany('concept-question', { async: false }) questions;
  @attr('string') conclusionMarkdown;
  @attr('string') descriptionMarkdown;
  @attr('string') introductionMarkdown;
  @attr('') sections; // free-form JSON
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

  get introductionHTML() {
    if (this.introductionMarkdown) {
      return htmlSafe(new showdown.Converter({ openLinksInNewWindow: true }).makeHtml(this.introductionMarkdown));
    } else {
      return null;
    }
  }

  get conclusionHTML() {
    if (this.conclusionMarkdown) {
      return htmlSafe(new showdown.Converter({ openLinksInNewWindow: true }).makeHtml(this.conclusionMarkdown));
    } else {
      return null;
    }
  }
}
