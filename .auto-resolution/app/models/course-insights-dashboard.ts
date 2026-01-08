import Model, { attr, belongsTo } from '@ember-data/model';

export default class CourseInsightsDashboardModel extends Model {
  @belongsTo('course', { async: false, inverse: null }) declare course: { slug: string };

  @attr('string') declare embedUrl: string;
}
