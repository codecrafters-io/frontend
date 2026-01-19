import CourseModel from 'codecrafters-frontend/models/course';
import Model, { attr, belongsTo } from '@ember-data/model';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';

export default class CourseExtensionModel extends Model {
  @belongsTo('course', { async: false, inverse: 'extensions' }) declare course: CourseModel;

  @attr('string') declare descriptionMarkdown: string;
  @attr('string') declare name: string;
  @attr('string') declare slug: string;
  @attr('number') declare position: number;

  get sortedStages() {
    return this.stages.toSorted(fieldComparator('positionWithinExtension'));
  }

  get stages() {
    return this.course.stages.filter((stage) => stage.primaryExtensionSlug === this.slug);
  }
}
