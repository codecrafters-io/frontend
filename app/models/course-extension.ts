import Model, { attr, belongsTo } from '@ember-data/model';
import { TemporaryCourseModel } from './temporary-types';
import { htmlSafe } from '@ember/template';
import showdown from 'showdown';

export default class CourseExtensionModel extends Model {
  @belongsTo('course', { async: false, inverse: 'extensions' }) declare course: TemporaryCourseModel;

  @attr('string') declare descriptionMarkdown: string;
  @attr('string') declare name: string;
  @attr('string') declare slug: string;

  get descriptionHtml() {
    return htmlSafe(new showdown.Converter({ openLinksInNewWindow: true }).makeHtml(this.descriptionMarkdown));
  }

  get stages() {
    return this.course.stages.filter((stage) => stage.primaryExtensionSlug === this.slug);
  }

  get sortedStages() {
    return this.stages.sortBy('positionWithinExtension');
  }
}
