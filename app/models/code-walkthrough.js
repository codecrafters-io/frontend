import { attr } from '@ember-data/model';
import Model from '@ember-data/model';

export default class CodeWalkthrough extends Model {
  @attr('string') conclusionMarkdown;
  @attr('string') descriptionMarkdown;
  @attr('string') hackerNewsUrl;
  @attr('string') introductionMarkdown;
  @attr('') sections; // free-form JSON
  @attr('string') slug;
  @attr('string') title;
  @attr('date') updatedAt;
}
