import Model, { attr, belongsTo } from '@ember-data/model';
import { TemporaryCourseStageModel, TemporaryLanguageModel, TemporaryUserModel } from './temporary-types';

export default class CourseStageLanguageGuideModel extends Model {
  @belongsTo('course-stage', { async: false, inverse: 'language-guides' }) declare courseStage: TemporaryCourseStageModel;
  @belongsTo('language', { async: false, inverse: null }) declare language: TemporaryLanguageModel;

  @attr('string') declare markdownForBeginner: string;
  @attr('string') declare markdownForIntermediate: string;
  @attr('string') declare markdownForAdvanced: string;
}
