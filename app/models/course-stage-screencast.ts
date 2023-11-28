import CourseStageModel from 'codecrafters-frontend/models/course-stage';
import LanguageModel from 'codecrafters-frontend/models/language';
import Model, { attr, belongsTo } from '@ember-data/model';
import UserModel from 'codecrafters-frontend/models/user';

export default class CourseStageScreencastModel extends Model {
  @belongsTo('course-stage', { async: false, inverse: 'screencasts' }) declare courseStage: CourseStageModel;

  @belongsTo('language', { async: false, inverse: null }) declare language: LanguageModel;
  @belongsTo('user', { async: false, inverse: null }) declare user: UserModel;

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
