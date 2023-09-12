import Model, { attr, belongsTo } from '@ember-data/model';
import { TemporaryCourseModel } from './temporary-types';


export default class CourseExtension extends Model {
  @belongsTo('course', { async: false }) declare course: TemporaryCourseModel;

  @attr('string') declare title: string;
  @attr('string') declare descriptionMarkdown: string;
}
