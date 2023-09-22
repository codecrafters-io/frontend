import Model, { attr, belongsTo } from '@ember-data/model';
import { TemporaryCourseStageModel, TemporaryLanguageModel, TemporaryUserModel } from './temporary-types';

export default class CourseStageScreencastModel extends Model {
  // @ts-ignore: not sure what's up here
  @belongsTo('course-stage', { async: false, inverse: 'screencasts' }) declare courseStage: TemporaryCourseStageModel;

  @belongsTo('language', { async: false, inverse: null }) declare language: TemporaryLanguageModel;
  @belongsTo('user', { async: false, inverse: null }) declare user: TemporaryUserModel;

  @attr('string') declare authorName: string;
  @attr('string') declare canonicalUrl: string;
  @attr('date') declare publishedAt: Date;
  @attr('string') declare description: string;
  @attr('number') declare durationInSeconds: number;
  @attr('string') declare embedHtml: string;
  @attr('string') declare sourceIconUrl: string;
  @attr('string') declare originalUrl: string;
  @attr('string') declare thumbnailUrl: string;
  @attr('string') declare title: string;
}
