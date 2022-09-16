import Model from '@ember-data/model';
import showdown from 'showdown';
import { attr } from '@ember-data/model';
import { htmlSafe } from '@ember/template';

export default class CourseIdeaModel extends Model {
  @attr('date') createdAt;
  @attr('string') descriptionMarkdown;
  @attr('boolean') isArchived;
  @attr('string') name;

  get descriptionHtml() {
    return htmlSafe(new showdown.Converter({ openLinksInNewWindow: true }).makeHtml(this.descriptionMarkdown));
  }
}
