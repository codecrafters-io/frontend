import Model from '@ember-data/model';
import { attr, belongsTo, hasMany } from '@ember-data/model';
import type CourseModel from './course';
import type LanguageModel from './language';
import type CommunitySolutionEvaluationModel from './community-solution-evaluation';

export default class CommunitySolutionEvaluatorModel extends Model {
  @belongsTo('course', { async: false, inverse: null }) declare course: CourseModel;
  @belongsTo('language', { async: false, inverse: null }) declare language: LanguageModel;

  @hasMany('community-solution-evaluation', { async: false, inverse: 'evaluator' }) declare evaluations: CommunitySolutionEvaluationModel[];

  @attr('string') declare slug: string;
  @attr('string') declare promptTemplate: string;
}
