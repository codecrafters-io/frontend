import Model from '@ember-data/model';
import { attr } from '@ember-data/model';

export default class CourseIdeaModel extends Model {
  @attr('string') name;
  @attr('string') descriptionMarkdown;
  @attr('date') createdAt;
  @attr('boolean') isArchived;
}
