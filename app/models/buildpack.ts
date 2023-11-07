import Model, { attr, belongsTo } from '@ember-data/model';
import { TemporaryCourseModel } from './temporary-types';
import LanguageModel from './language';

export default class BuildpackModel extends Model {
  @belongsTo('course', { async: false }) declare course: TemporaryCourseModel;
  @belongsTo('language', { async: false }) declare language: LanguageModel;

  @attr('string') declare dockerfileContents: string;
  @attr('date') declare updatedAt: Date;
  @attr('string') declare languageVersion?: string;
  @attr('string') declare slug: string;
}
