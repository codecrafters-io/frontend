import { attr } from '@ember-data/model';
import Model from '@ember-data/model';

export default class CourseModel extends Model {
  @attr('string') descriptionMd;
  @attr('string') difficulty;
  @attr('string') shortDescriptionMd;
  @attr('string') slug;
}
