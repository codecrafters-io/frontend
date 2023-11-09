import Model, { attr, belongsTo } from '@ember-data/model';
import { TemporaryCourseModel } from 'codecrafters-frontend/lib/temporary-types';

export default class CourseExtensionModel extends Model {
  @belongsTo('course', { async: false, inverse: 'extensions' }) declare course: TemporaryCourseModel;

  @attr('string') declare descriptionMarkdown: string;
  @attr('string') declare name: string;
  @attr('string') declare slug: string;

  get sortedStages() {
    return this.stages.sortBy('positionWithinExtension');
  }

  get stages() {
    return this.course.stages.filter((stage) => stage.primaryExtensionSlug === this.slug);
  }
}
